import { aiQuizSchema } from "@/lib/validation";
import type { GenerateQuizInput, GeneratedQuiz, Question } from "@/types/quiz";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 45000;

// GROQ_MODEL is tried first. If it is overloaded, rate-limited or unavailable,
// the next model in this list is tried automatically.
// GROQ_FALLBACK_MODEL (optional) is tried before the built-in fallbacks.
const BUILT_IN_FALLBACKS = ["openai/gpt-oss-120b", "llama-3.1-8b-instant"];

const MODELS = Array.from(
  new Set(
    [
      process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      process.env.GROQ_FALLBACK_MODEL,
      ...BUILT_IN_FALLBACKS,
    ].filter((m): m is string => Boolean(m))
  )
);

const MAX_ATTEMPTS = 2; // for malformed AI output
const BUSY_RETRIES = 2; // extra tries per model on 500/502/503
const RETRY_DELAY_MS = 2000;

class MalformedQuizError extends Error {}

class GroqApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function getApiKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in .env.local");
  }
  return apiKey;
}

function buildPrompt({ topic, difficulty, questionCount }: GenerateQuizInput) {
  return `Generate a multiple-choice quiz.

Topic: ${topic}
Difficulty: ${difficulty}
Number of Questions: ${questionCount}

Rules:

1. Generate exactly the requested number of questions.
2. Each question must contain exactly four options.
3. Only one option can be correct.
4. The correctAnswer must exactly match one option.
5. Questions must be factually accurate.
6. Do not duplicate questions.
7. Match the requested difficulty.
8. Provide a concise explanation.
9. Include the specific subtopic tested.
10. Vary which option position holds the correct answer.

Return ONLY valid JSON (no markdown, no extra text) in exactly this shape:

{
  "title": "short quiz title",
  "questions": [
    {
      "question": "question text",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correctAnswer": "must be identical to one of the four options",
      "explanation": "short explanation",
      "topic": "specific subtopic"
    }
  ]
}`;
}

// Cleans up the AI output and enforces our own rules on top of the schema.
function normalizeQuestions(
  raw: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
  }[],
  expectedCount: number
): Question[] {
  const questions = raw.map((q) => {
    const options = q.options.map((o) => o.trim());

    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) {
      throw new MalformedQuizError("Duplicate options in a question");
    }

    const match = options.find(
      (o) => o.toLowerCase() === q.correctAnswer.trim().toLowerCase()
    );
    if (!match) {
      throw new MalformedQuizError("correctAnswer does not match any option");
    }

    return {
      question: q.question.trim(),
      options,
      correctAnswer: match,
      explanation: q.explanation.trim(),
      topic: q.topic.trim(),
    };
  });

  if (questions.length < expectedCount) {
    throw new MalformedQuizError("The AI returned too few questions");
  }

  return questions.slice(0, expectedCount);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isBusy(error: unknown) {
  return (
    error instanceof GroqApiError && [500, 502, 503].includes(error.status)
  );
}

// One HTTP call to Groq. Returns the raw text of the model's reply.
async function callGroq(model: string, input: GenerateQuizInput) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an educational quiz generator. You always reply with valid JSON only.",
          },
          { role: "user", content: buildPrompt(input) },
        ],
        temperature: 0.7,
        max_completion_tokens: 4096,
        response_format: { type: "json_object" },
        ...(model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new GroqApiError(
      res.status,
      body?.error?.message ?? res.statusText,
      body?.error?.code
    );
  }

  const data = await res.json();
  const content: unknown = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : undefined;
}

// Retries a few times if Groq is temporarily busy.
async function requestQuizText(model: string, input: GenerateQuizInput) {
  for (let i = 0; i <= BUSY_RETRIES; i++) {
    const startedAt = Date.now();
    console.log(`[groq] request started (model: ${model})`);

    try {
      const text = await callGroq(model, input);
      console.log(`[groq] response received in ${Date.now() - startedAt}ms`);
      return text;
    } catch (error) {
      if (!isBusy(error) || i === BUSY_RETRIES) throw error;
      const delay = RETRY_DELAY_MS * (i + 1);
      console.warn(`[groq] ${model} is busy, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}

async function generateWithModel(
  model: string,
  input: GenerateQuizInput
): Promise<GeneratedQuiz> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let text: string | undefined;

    try {
      text = await requestQuizText(model, input);
    } catch (error) {
      // Groq rejected the model's own output as invalid JSON: retry.
      if (
        error instanceof GroqApiError &&
        error.status === 400 &&
        error.code === "json_validate_failed"
      ) {
        lastError = new MalformedQuizError("Groq could not produce valid JSON");
        console.error(`[groq] invalid JSON from model (attempt ${attempt})`);
        continue;
      }
      throw error;
    }

    try {
      if (!text) throw new MalformedQuizError("Empty response from the AI");

      // Some models wrap JSON in markdown fences; strip them if present.
      const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");

      let json: unknown;
      try {
        json = JSON.parse(cleaned);
      } catch {
        throw new MalformedQuizError("Response was not valid JSON");
      }

      const parsed = aiQuizSchema.safeParse(json);
      if (!parsed.success) {
        throw new MalformedQuizError("Response did not match the quiz schema");
      }

      return {
        title: parsed.data.title.trim(),
        topic: input.topic,
        difficulty: input.difficulty,
        questions: normalizeQuestions(
          parsed.data.questions,
          input.questionCount
        ),
      };
    } catch (error) {
      // Only malformed AI output is retried here.
      if (!(error instanceof MalformedQuizError)) throw error;
      lastError = error;
      console.error(
        `[groq] malformed output (attempt ${attempt}):`,
        error.message
      );
    }
  }

  throw lastError;
}

function canFallBack(error: unknown) {
  if (!(error instanceof GroqApiError)) return false;
  if ([429, 404, 500, 502, 503].includes(error.status)) return true;
  // e.g. a decommissioned or unsupported model
  return error.status === 400 && /model/i.test(error.message);
}

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GeneratedQuiz> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      return await generateWithModel(model, input);
    } catch (error) {
      lastError = error;
      if (!canFallBack(error)) throw error;
      console.warn(`[groq] ${model} unavailable, trying next model...`);
    }
  }

  throw lastError;
}