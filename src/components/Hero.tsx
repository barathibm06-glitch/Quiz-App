import Link from "next/link";
import { Sparkles } from "lucide-react";

const options = [
  { label: "A", text: "function", correct: false },
  { label: "B", text: "def", correct: true },
  { label: "C", text: "define", correct: false },
  { label: "D", text: "func", correct: false },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.25),transparent_45%)]">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-medium text-violet-soft">
            <Sparkles size={14} />
            AI-powered quiz platform
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="block">Turn Any Topic</span>
            <span className="block bg-gradient-to-r from-violet via-violet-bright to-cyan bg-clip-text text-transparent">
              Into an AI Quiz.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-2">
            Generate personalized quizzes instantly, test your knowledge, and
            discover what you need to improve.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/quiz/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
            >
              <Sparkles size={18} />
              Generate My Quiz
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-text-2 transition hover:bg-white/10 hover:text-text"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Right: quiz preview */}
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet/40 to-cyan/30 blur-3xl"
          />

          <div className="relative rounded-3xl border border-white/10 bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/15 px-3 py-1 text-[11px] font-semibold tracking-widest text-violet-soft">
              ✦ AI GENERATED QUIZ
            </span>

            <h3 className="mt-4 text-xl font-bold">Python Functions</h3>
            <p className="mt-1 text-sm text-muted">Medium • 10 Questions</p>

            <div className="mt-6 flex items-center justify-between text-xs text-muted">
              <span>Question 03 / 10</span>
              <span>30%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-surface">
              <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-violet to-cyan" />
            </div>

            <p className="mt-6 text-lg font-semibold leading-snug">
              Which keyword defines a function in Python?
            </p>

            <div className="mt-5 space-y-3">
              {options.map((o) => (
                <div
                  key={o.label}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                    o.correct
                      ? "border-success/60 bg-success/10 text-text"
                      : "border-white/10 bg-surface text-text-2 hover:bg-card-hover"
                  }`}
                >
                  <span>
                    <span className="mr-2 font-semibold text-muted">
                      {o.label}.
                    </span>
                    {o.text}
                  </span>
                  {o.correct && <span className="font-bold text-success">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}