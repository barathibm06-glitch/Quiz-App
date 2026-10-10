import Navbar from "@/components/Navbar";
import QuizForm from "@/components/QuizForm";
import { requireSession } from "@/lib/auth";
import { getQuizQuota } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export default async function CreateQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const initialTopic = (topic ?? "").slice(0, 100);

  const session = await requireSession(
    initialTopic
      ? `/quiz/create?topic=${encodeURIComponent(initialTopic)}`
      : "/quiz/create"
  );
  const quota = await getQuizQuota(session.userId);

  return (
    <div className="min-h-screen bg-navy bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.25),transparent_45%)]">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl px-6 py-14">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Create Your{" "}
            <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">
              AI Quiz
            </span>
          </h1>
          <p className="mt-4 text-text-2">
            Choose what you want to learn
            <br />
            and let AI build your quiz.
          </p>
        </div>

        <div className="mt-10">
          <QuizForm initialTopic={initialTopic} quota={quota} />
        </div>
      </main>
    </div>
  );
}
