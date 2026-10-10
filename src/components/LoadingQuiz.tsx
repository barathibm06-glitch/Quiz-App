"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";

const steps = [
  "Analyzing topic...",
  "Generating questions...",
  "Preparing explanations...",
  "Finalizing your quiz...",
];

export default function LoadingQuiz() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => Math.min(i + 1, steps.length - 1));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center py-10 text-center">
      {/* Animated loader */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,#7c3aed,#22d3ee,transparent_70%)]" />
        <div className="absolute inset-1.5 rounded-full bg-card" />
        <div className="absolute inset-0 flex items-center justify-center text-violet-soft">
          <Sparkles size={26} className="animate-pulse" />
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold">✨ Creating your quiz</h2>
      <p className="mt-2 text-sm text-muted">This usually takes a few seconds.</p>

      <ul className="mt-8 space-y-3 text-left">
        {steps.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-sm transition-colors ${
                done
                  ? "text-text-2"
                  : current
                    ? "font-semibold text-text"
                    : "text-muted/60"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  done
                    ? "bg-success/20 text-success"
                    : current
                      ? "animate-pulse bg-violet/30 text-violet-soft"
                      : "bg-white/5"
                }`}
              >
                {done ? <Check size={12} /> : "•"}
              </span>
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}