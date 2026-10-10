"use client";

import { useEffect, useState } from "react";
import { getScoreStyles } from "@/lib/score";

type ScoreCardProps = {
  title: string;
  score: number;
  total: number;
  percentage: number;
  name: string;
};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getMessage(percentage: number, name: string) {
  if (percentage === 100) return `Perfect score, ${name}!`;
  if (percentage >= 80) return `Great job, ${name}!`;
  if (percentage >= 60) return `Good effort, ${name}!`;
  return `Keep practicing, ${name}!`;
}

export default function ScoreCard({
  title,
  score,
  total,
  percentage,
  name,
}: ScoreCardProps) {
  const styles = getScoreStyles(percentage);

  // Start empty, then animate the ring to the real value.
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(percentage));
    return () => cancelAnimationFrame(frame);
  }, [percentage]);

  const offset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card px-6 py-12 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.3),transparent_60%)]"
      />

      <div className="relative">
        <span className="inline-flex rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-violet-soft">
          QUIZ COMPLETED 🎉
        </span>
        <p className="mt-4 text-sm text-muted">{title}</p>

        <div className="relative mx-auto mt-8 h-44 w-44">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              className="stroke-white/10"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={`${styles.stroke} transition-[stroke-dashoffset] duration-1000 ease-out`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold">
              {score} / {total}
            </span>
            <span className={`mt-1 text-lg font-bold ${styles.text}`}>
              {percentage}%
            </span>
          </div>
        </div>

        <p className="mt-8 text-xl font-semibold">
          {getMessage(percentage, name)}
        </p>
      </div>
    </div>
  );
}