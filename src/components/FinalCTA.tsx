import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.3),transparent_60%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to challenge yourself?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-2">
              Turn your next topic into an AI-powered quiz.
            </p>
            <Link
              href="/quiz/create"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
            >
              Create My Quiz
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
