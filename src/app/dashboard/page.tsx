import Link from "next/link";
import { BookOpen, Gauge, HelpCircle, Plus, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import QuizCard from "@/components/QuizCard";
import WeakTopics from "@/components/WeakTopics";
import { getDashboardData } from "@/lib/quizStats";
import { getQuizQuota } from "@/lib/rateLimit";
import { firstName, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession("/dashboard");
  const [{ stats, recent, weakTopics }, quota] = await Promise.all([
    getDashboardData(session.userId),
    getQuizQuota(session.userId),
  ]);

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {firstName(session.name)} 👋
            </h1>
            <p className="mt-2 text-text-2">Ready to challenge yourself?</p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Link
              href="/quiz/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
            >
              <Plus size={18} />
              Create New Quiz
            </Link>
            <p className="text-xs text-muted">
              {quota.remaining} of {quota.limit} quizzes left today
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="QUIZZES" value={stats.quizzes} icon={BookOpen} />
          <StatCard
            label="AVG SCORE"
            value={stats.avgScore === null ? "—" : `${stats.avgScore}%`}
            icon={Gauge}
          />
          <StatCard
            label="BEST SCORE"
            value={stats.bestScore === null ? "—" : `${stats.bestScore}%`}
            icon={Trophy}
          />
          <StatCard
            label="QUESTIONS"
            value={stats.questions}
            icon={HelpCircle}
          />
        </div>

        {/* Recent quizzes + focus areas */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="text-xl font-bold">Recent Quizzes</h2>

            {recent.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-card/50 px-6 py-12 text-center">
                <p className="text-text-2">
                  You haven&apos;t completed any quizzes yet.
                </p>
                <Link
                  href="/quiz/create"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Plus size={16} />
                  Create your first quiz
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {recent.map((q) => (
                  <QuizCard key={q.id} {...q} />
                ))}
              </div>
            )}
          </section>

          <aside>
            <WeakTopics topics={weakTopics} />
          </aside>
        </div>
      </main>
    </div>
  );
}
