import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export const DAILY_QUIZ_LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000; // rolling 24 hours

export type QuizQuota = {
  used: number;
  limit: number;
  remaining: number;
  resetsIn: string | null; // e.g. "3 hours" (only when no quizzes are left)
};

function formatDuration(ms: number) {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

// Only saved (successfully generated) quizzes count towards the limit.
export async function getQuizQuota(userId: string): Promise<QuizQuota> {
  await connectDB();

  const since = new Date(Date.now() - WINDOW_MS);
  const recent = await Quiz.find({ userId, createdAt: { $gte: since } })
    .sort({ createdAt: 1 })
    .select("createdAt")
    .lean();

  const used = recent.length;
  const remaining = Math.max(0, DAILY_QUIZ_LIMIT - used);

  let resetsIn: string | null = null;
  if (remaining === 0) {
    // A slot frees up when the quiz that is blocking us turns 24 hours old.
    const blocking = recent[used - DAILY_QUIZ_LIMIT];
    resetsIn = formatDuration(
      new Date(blocking.createdAt).getTime() + WINDOW_MS - Date.now()
    );
  }

  return { used, limit: DAILY_QUIZ_LIMIT, remaining, resetsIn };
}

export function quotaExceededMessage(quota: QuizQuota) {
  return `You've used all ${quota.limit} quizzes for today.${
    quota.resetsIn ? ` Please try again in about ${quota.resetsIn}.` : ""
  }`;
}
