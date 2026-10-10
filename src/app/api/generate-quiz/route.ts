import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { generateQuiz } from "@/lib/groq";
import { getQuizQuota, quotaExceededMessage } from "@/lib/rateLimit";
import { generateQuizInputSchema } from "@/lib/validation";
import Quiz from "@/models/Quiz";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to create a quiz." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = generateQuizInputSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Please enter a valid topic, difficulty and question count." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Daily limit: checked before calling Gemini so no AI call is wasted.
    const quota = await getQuizQuota(session.userId);
    if (quota.remaining <= 0) {
      return NextResponse.json(
        { error: quotaExceededMessage(quota) },
        { status: 429 }
      );
    }

    const quiz = await generateQuiz(input.data);

    const saved = await Quiz.create({
      ...quiz,
      questionCount: input.data.questionCount,
      userId: session.userId,
    });

    // Guards against two requests slipping past the check at the same moment.
    const after = await getQuizQuota(session.userId);
    if (after.used > after.limit) {
      await Quiz.deleteOne({ _id: saved._id });
      return NextResponse.json(
        { error: quotaExceededMessage(after) },
        { status: 429 }
      );
    }

    return NextResponse.json({ id: saved._id.toString() }, { status: 201 });
  } catch (error) {
    // Full error stays in the server log; the student only sees a friendly message.
    console.error("[generate-quiz]", error);
    return NextResponse.json(
      { error: "We couldn't generate your quiz right now. Please try again." },
      { status: 500 }
    );
  }
}