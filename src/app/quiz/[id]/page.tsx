import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuizRunner from "@/components/QuizRunner";
import { connectDB } from "@/lib/mongodb";
import { requireSession } from "@/lib/auth";
import Quiz from "@/models/Quiz";
import type { Difficulty } from "@/types/quiz";

export const dynamic = "force-dynamic";

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession(`/quiz/${id}`);

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const quiz = await Quiz.findOne({ _id: id, userId: session.userId }).lean();

  if (!quiz) notFound();
  if (quiz.completed) redirect(`/quiz/${id}/result`);

  // Strip correct answers and explanations before sending to the browser.
  const questions = quiz.questions.map((q) => ({
    question: q.question,
    options: q.options,
  }));

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <QuizRunner
          quizId={id}
          title={quiz.title}
          difficulty={quiz.difficulty as Difficulty}
          questions={questions}
        />
      </main>
    </div>
  );
}
