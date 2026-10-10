import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { getScoreStyles } from "@/lib/score";

type WeakTopicsProps = {
  topics: { topic: string; percentage: number }[];
};

export default function WeakTopics({ topics }: WeakTopicsProps) {
  const weakest = topics[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-violet-soft" />
        <h2 className="text-lg font-bold">Your Focus Areas</h2>
      </div>

      {topics.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          No weak areas yet. Complete a few quizzes and the topics you need to
          practice will show up here.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {topics.map((t) => {
            const styles = getScoreStyles(t.percentage);
            return (
              <div key={t.topic}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-text-2">{t.topic}</span>
                  <span className={`font-bold ${styles.text}`}>
                    {t.percentage}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-surface">
                  <div
                    className={`h-full rounded-full ${styles.bar}`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href={
          weakest
            ? `/quiz/create?topic=${encodeURIComponent(weakest.topic)}`
            : "/quiz/create"
        }
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet/40 bg-violet/10 px-5 py-3 text-sm font-semibold text-violet-soft transition hover:bg-violet/20"
      >
        {weakest ? "Practice Again" : "Create a Quiz"}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}