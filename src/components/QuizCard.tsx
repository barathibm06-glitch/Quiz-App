import Link from "next/link";
import type { Difficulty } from "@/types/quiz";
import { getScoreStyles } from "@/lib/score";

type QuizCardProps = {
  id: string;
  title: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  percentage: number;
};

export default function QuizCard({
  id,
  title,
  difficulty,
  score,
  total,
  percentage,
}: QuizCardProps) {
  const styles = getScoreStyles(percentage);

  return (
    <Link
      href={`/quiz/${id}/result`}
      className="block rounded-2xl border border-white/10 bg-card p-5 transition hover:-translate-y-0.5 hover:border-violet/40 hover:bg-card-hover"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{title}</h3>
          <span className="mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-2">
            {difficulty}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <span className="text-sm text-muted">
            {score} / {total}
          </span>
          <span
            className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${styles.text} ${styles.bg} ${styles.border}`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full rounded-full bg-surface">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Link>
  );
}