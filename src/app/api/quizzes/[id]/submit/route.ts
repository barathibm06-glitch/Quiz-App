import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { submitQuizSchema } from "@/lib/validation";
import {
  computeTopicStats,
  evaluateAnswers,
  getWeakestTopic,
} from "@/lib/evaluate";
import Quiz from "@/models/Quiz";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to submit your quiz." },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = submitQuizSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  }

  try {
    await connectDB();

    const quiz = await Quiz.findOne({
      _id: id,
      userId: session.userId,
    }).lean();
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }
    if (quiz.completed) {
      return NextResponse.json(
        { error: "This quiz has already been submitted." },
        { status: 409 }
      );
    }

    const selections = input.data.answers;
    const validAnswers =
      selections.length === quiz.questions.length &&
      quiz.questions.every((q, i) => q.options.includes(selections[i]));

    if (!validAnswers) {
      return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
    }

    const { answers, score, total, percentage } = evaluateAnswers(
      quiz.questions,
      selections
    );

    // Only updates if the quiz is still unsubmitted (prevents double submits).
    const update = await Quiz.updateOne(
      { _id: id, userId: session.userId, completed: false },
      { $set: { score, percentage, answers, completed: true } }
    );
    if (update.modifiedCount === 0) {
      return NextResponse.json(
        { error: "This quiz has already been submitted." },
        { status: 409 }
      );
    }

    const weakest = getWeakestTopic(computeTopicStats(quiz.questions, answers));

    return NextResponse.json({
      score,
      total,
      percentage,
      weakestTopic: weakest?.topic ?? null,
    });
  } catch (error) {
    console.error("[submit-quiz]", error);
    return NextResponse.json(
      { error: "We couldn't submit your quiz right now. Please try again." },
      { status: 500 }
    );
  }
}
