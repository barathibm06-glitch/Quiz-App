import { z } from "zod";

// Accepts "Easy" / "easy" / "EASY" and normalizes to "Easy".
const difficultySchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.length > 0
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : value,
  z.enum(["Easy", "Medium", "Hard"])
);

// Request sent from the Create Quiz page.
export const generateQuizInputSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(2)
    .max(100)
    // collapse line breaks / repeated spaces before the topic goes into the AI prompt
    .transform((value) => value.replace(/\s+/g, " ")),
  difficulty: difficultySchema,
  questionCount: z.union([z.literal(5), z.literal(10), z.literal(15)]),
});

// What we expect Gemini to return.
export const aiQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
  topic: z.string().min(1),
});

export const aiQuizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(aiQuestionSchema).min(1),
});

// Answers sent when a student submits a quiz (one selected option per question, in order).
export const submitQuizSchema = z.object({
  answers: z.array(z.string().min(1)).min(1).max(15),
});

// ---- Auth
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Please enter a valid email address.")
  .pipe(z.email("Please enter a valid email address."));

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (2–50 characters).")
    .max(50, "Please enter your name (2–50 characters)."),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be 8–72 characters.")
    .max(72, "Password must be 8–72 characters."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Please enter your password.").max(72),
});
