"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Send } from "lucide-react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import type { Difficulty } from "@/types/quiz";

// Only what the student needs to see. Correct answers never reach the browser.
export type PublicQuestion = {
  question: string;
  options: string[];
};

type QuizRunnerProps = {
  quizId: string;
  title: string;
  difficulty: Difficulty;
  questions: PublicQuestion[];
};

export default function QuizRunner({
  quizId,
  title,
  difficulty,
  questions,
}: QuizRunnerProps) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    questions.map(() => null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = questions.length;
  const current = questions[index];
  const isLast = index === total - 1;
  const unanswered = answers.filter((a) => a === null).length;

  function selectOption(option: string) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? option : a)));
  }

  async function handleSubmit() {
    if (unanswered > 0 || submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      // 409 = already submitted, so the result page is still the right place.
      if (!res.ok && res.status !== 409) {
        throw new Error("Submit failed");
      }

      router.push(`/quiz/${quizId}/result`);
    } catch {
      setError("We couldn't submit your quiz. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Question {index + 1} of {total}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-2">
            {difficulty}
          </span>
        </div>

        <div className="mt-5">
          <ProgressBar value={((index + 1) / total) * 100} />
        </div>
      </div>

      {/* Question */}
      <QuestionCard
        key={index}
        number={index + 1}
        question={current.question}
        options={current.options}
        selected={answers[index]}
        onSelect={selectOption}
        disabled={submitting}
      />

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0 || submitting}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-text-2 transition hover:bg-white/10 hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={unanswered > 0 || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
            <Send size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      {isLast && unanswered > 0 && (
        <p className="mt-4 text-right text-sm text-muted">
          {unanswered} question{unanswered > 1 ? "s" : ""} still unanswered.
        </p>
      )}
    </div>
  );
}