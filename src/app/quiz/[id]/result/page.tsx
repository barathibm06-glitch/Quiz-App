import Link from "next/link";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import { Check, LayoutDashboard, Plus, Signal, X, Gauge } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScoreCard from "@/components/ScoreCard";
import StatCard from "@/components/StatCard";
import AIInsight from "@/components/AIInsight";
import AnswerReview, { type ReviewItem } from "@/components/AnswerReview";
import { connectDB } from "@/lib/mongodb";
import { firstName, requireSession } from "@/lib/auth";
import { computeTopicStats, getWeakestTopic } from "@/lib/evaluate";
import Quiz from "@/models/Quiz";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession(`/quiz/${id}/result`);

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const quiz = await Quiz.findOne({ _id: id, userId: session.userId }).lean();

  if (!quiz) notFound();
  if (!quiz.completed) redirect(`/quiz/${id}`);

  const total = quiz.questions.length;
  const correct = quiz.score;
  const incorrect = total - correct;

  const items: ReviewItem[] = quiz.questions.map((q, i) => {
    const answer = quiz.answers.find((a) => a.questionIndex === i);
    return {
      number: i + 1,
      question: q.question,
      selected: answer?.selected ?? "No answer",
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect: answer?.isCorrect ?? false,
    };
  });

  const topicStats = computeTopicStats(
    quiz.questions,
    quiz.questions.map((_, i) => ({
      isCorrect: quiz.answers.find((a) => a.questionIndex === i)?.isCorrect ?? false,
    }))
  );
  const weakest = getWeakestTopic(topicStats);

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl space-y-10 px-6 py-10">
        <ScoreCard
          title={quiz.title}
          score={correct}
          total={total}
          percentage={quiz.percentage}
          name={firstName(session.name)}
        />

        {/* Performance cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="CORRECT" value={correct} icon={Check} />
          <StatCard label="INCORRECT" value={incorrect} icon={X} />
          <StatCard label="ACCURACY" value={`${quiz.percentage}%`} icon={Gauge} />
          <StatCard label="DIFFICULTY" value={quiz.difficulty} icon={Signal} />
        </div>

        <AIInsight weakest={weakest} stats={topicStats} />

        <section>
          <h2 className="mb-5 text-xl font-bold">Answer Review</h2>
          <AnswerReview items={items} />
        </section>

        <div className="flex flex-wrap items-center justify-center gap-4 pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-text-2 transition hover:bg-white/10 hover:text-text"
          >
            <LayoutDashboard size={18} />
            Back to Dashboard
          </Link>
          <Link
            href="/quiz/create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
          >
            <Plus size={18} />
            Create New Quiz
          </Link>
        </div>
      </main>
    </div>
  );
}
