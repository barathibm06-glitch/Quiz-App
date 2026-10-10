import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import type { Difficulty } from "@/types/quiz";

export type DashboardData = {
  stats: {
    quizzes: number;
    avgScore: number | null;
    bestScore: number | null;
    questions: number;
  };
  recent: {
    id: string;
    title: string;
    difficulty: Difficulty;
    score: number;
    total: number;
    percentage: number;
  }[];
  weakTopics: { topic: string; percentage: number }[];
};

const RECENT_LIMIT = 5;
const WEAK_TOPIC_QUIZZES = 20; // newest quizzes used for focus areas
const WEAK_THRESHOLD = 80; // topics below this % count as weak

export async function getDashboardData(userId: string): Promise<DashboardData> {
  await connectDB();

  const quizzes = await Quiz.find({ userId, completed: true })
    .sort({ createdAt: -1 })
    .limit(200)
    .select(
      "title difficulty questionCount score percentage questions.topic answers.questionIndex answers.isCorrect"
    )
    .lean();

  // ---- Stats
  const count = quizzes.length;
  const stats: DashboardData["stats"] = {
    quizzes: count,
    avgScore: count
      ? Math.round(quizzes.reduce((sum, q) => sum + q.percentage, 0) / count)
      : null,
    bestScore: count ? Math.max(...quizzes.map((q) => q.percentage)) : null,
    questions: quizzes.reduce((sum, q) => sum + q.questionCount, 0),
  };

  // ---- Recent quizzes
  const recent = quizzes.slice(0, RECENT_LIMIT).map((q) => ({
    id: String(q._id),
    title: q.title,
    difficulty: q.difficulty as Difficulty,
    score: q.score,
    total: q.questionCount,
    percentage: q.percentage,
  }));

  // ---- Weak topics across recent quizzes
  const groups = new Map<string, { topic: string; correct: number; total: number }>();

  for (const quiz of quizzes.slice(0, WEAK_TOPIC_QUIZZES)) {
    quiz.questions.forEach((question, i) => {
      const key = question.topic.trim().toLowerCase();
      const group = groups.get(key) ?? {
        topic: question.topic.trim(),
        correct: 0,
        total: 0,
      };
      group.total += 1;
      const answer = quiz.answers.find((a) => a.questionIndex === i);
      if (answer?.isCorrect) group.correct += 1;
      groups.set(key, group);
    });
  }

  const weakTopics = Array.from(groups.values())
    .map((g) => ({
      topic: g.topic,
      percentage: Math.round((g.correct / g.total) * 100),
    }))
    .filter((t) => t.percentage < WEAK_THRESHOLD)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 4);

  return { stats, recent, weakTopics };
}
