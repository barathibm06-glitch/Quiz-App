"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import LoadingQuiz from "./LoadingQuiz";
import type { Difficulty, QuestionCount } from "@/types/quiz";

const suggestions = [
  "Python",
  "JavaScript",
  "DBMS",
  "Operating Systems",
  "Data Structures",
  "Computer Networks",
];

const difficulties: {
  value: Difficulty;
  dot: string;
  label: string;
  sub: string;
}[] = [
  { value: "Easy", dot: "🟢", label: "Easy", sub: "Beginner" },
  { value: "Medium", dot: "🟡", label: "Medium", sub: "Balanced" },
  { value: "Hard", dot: "🔴", label: "Hard", sub: "Advanced" },
];

const counts: QuestionCount[] = [5, 10, 15];

type QuizFormProps = {
  initialTopic?: string;
  quota: { remaining: number; limit: number; resetsIn: string | null };
};

export default function QuizForm({ initialTopic = "", quota }: QuizFormProps) {
  const router = useRouter();

  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = topic.trim();
  const canSubmit = trimmed.length >= 2 && !loading && quota.remaining > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void generate();
  }

  async function generate() {
    if (trimmed.length < 2) {
      setError("Please enter a topic (at least 2 characters).");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed, difficulty, questionCount }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        router.push("/login?next=/quiz/create");
        return;
      }

      if (res.status === 429) {
        setError(
          data?.error ?? "You've reached today's quiz limit. Please try again later."
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data?.id) {
        throw new Error("Generation failed");
      }

      // Keep the loader visible while the quiz page loads.
      router.push(`/quiz/${data.id}`);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Network problem. Check your internet connection and try again."
          : "We couldn't generate your quiz right now. Please try again."
      );
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-card/80 p-8 backdrop-blur-xl">
        <LoadingQuiz />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-white/10 bg-card/80 p-6 backdrop-blur-xl sm:p-8"
    >
      {/* Topic */}
      <div>
        <label htmlFor="topic" className="text-sm font-semibold">
          What do you want to learn?
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          maxLength={100}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter any topic..."
          className="mt-3 w-full rounded-xl border border-white/10 bg-surface px-4 py-3.5 text-text placeholder:text-muted/70 outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTopic(s)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                topic === s
                  ? "border-violet bg-violet/20 text-text"
                  : "border-white/10 bg-white/5 text-text-2 hover:border-violet/40 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-sm font-semibold">Choose Difficulty</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {difficulties.map((d) => {
            const selected = difficulty === d.value;
            return (
              <button
                key={d.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setDifficulty(d.value)}
                className={`rounded-2xl border px-3 py-4 text-center transition ${
                  selected
                    ? "border-violet bg-card-hover shadow-[0_0_24px_rgba(124,58,237,0.35)]"
                    : "border-white/10 bg-surface hover:bg-card-hover"
                }`}
              >
                <span className="block text-sm font-bold">
                  {d.dot} {d.label}
                </span>
                <span className="mt-1 block text-xs text-muted">{d.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question count */}
      <div>
        <p className="text-sm font-semibold">Number of Questions</p>
        <div className="mt-3 flex gap-3">
          {counts.map((c) => {
            const selected = questionCount === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                onClick={() => setQuestionCount(c)}
                className={`h-12 w-16 rounded-xl border text-sm font-bold transition ${
                  selected
                    ? "border-violet bg-violet/20 text-text shadow-[0_0_18px_rgba(124,58,237,0.3)]"
                    : "border-white/10 bg-surface text-text-2 hover:bg-card-hover"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          {canSubmit && (
            <button
              type="button"
              onClick={generate}
              className="shrink-0 rounded-lg border border-danger/40 px-3 py-1 text-xs font-semibold transition hover:bg-danger/10"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Daily quota */}
      {quota.remaining === 0 ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            You&apos;ve used all {quota.limit} quizzes for today.
            {quota.resetsIn ? ` Please try again in about ${quota.resetsIn}.` : ""}
          </span>
        </div>
      ) : (
        <p className="text-center text-sm text-muted">
          {quota.remaining} of {quota.limit} quizzes left today
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-4 font-semibold text-white shadow-lg shadow-violet/30 transition hover:shadow-xl hover:shadow-violet/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
      >
        <Sparkles size={18} />
        Generate Quiz
        <ArrowRight
          size={18}
          className="transition group-hover:translate-x-1 group-disabled:translate-x-0"
        />
      </button>
    </form>
  );
}
