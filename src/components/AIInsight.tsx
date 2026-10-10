import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getScoreStyles } from "@/lib/score";
import type { TopicStat } from "@/lib/evaluate";

type AIInsightProps = {
  weakest: TopicStat | null;
  stats: TopicStat[];
};

export default function AIInsight({ weakest, stats }: AIInsightProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet/40 bg-gradient-to-br from-violet/15 to-cyan/10 p-6 sm:p-8">
      <span className="inline-flex rounded-full bg-violet/20 px-3 py-1 text-[11px] font-semibold tracking-widest text-violet-soft">
        ✦ AI LEARNING INSIGHT
      </span>

      {weakest ? (
        <>
          <p className="mt-4 text-lg leading-relaxed">
            Your performance suggests that{" "}
            <span className="font-bold text-violet-soft">{weakest.topic}</span>{" "}
            needs more practice.
          </p>
          <p className="mt-2 text-text-2">
            You scored {weakest.percentage}% in this area.
          </p>
          <p className="mt-4 text-sm text-text-2">
            <span className="font-semibold text-text">Recommended:</span>{" "}
            review {weakest.topic} and take another quiz focused on it.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-lg leading-relaxed">
            You answered every topic correctly. Excellent work!
          </p>
          <p className="mt-2 text-text-2">
            Try a harder difficulty or a new topic to keep challenging yourself.
          </p>
        </>
      )}

      {stats.length > 1 && (
        <div className="mt-6 space-y-3">
          {stats.map((s) => {
            const styles = getScoreStyles(s.percentage);
            return (
              <div key={s.topic}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-text-2">{s.topic}</span>
                  <span className={`font-bold ${styles.text}`}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface">
                  <div
                    className={`h-full rounded-full ${styles.bar}`}
                    style={{ width: `${s.percentage}%` }}
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
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
      >
        {weakest ? "Practice This Topic" : "Create Another Quiz"}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}