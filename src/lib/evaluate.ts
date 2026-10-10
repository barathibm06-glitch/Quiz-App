import type { Question, QuizAnswer } from "@/types/quiz";

export type TopicStat = {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
};

// Compares each selected option with the stored correct answer.
export function evaluateAnswers(
  questions: Pick<Question, "correctAnswer">[],
  selections: string[]
) {
  const answers: QuizAnswer[] = questions.map((q, i) => ({
    questionIndex: i,
    selected: selections[i],
    isCorrect: selections[i] === q.correctAnswer,
  }));

  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return { answers, score, total, percentage };
}

// Groups results by question topic. Weakest topic comes first.
export function computeTopicStats(
  questions: Pick<Question, "topic">[],
  answers: Pick<QuizAnswer, "isCorrect">[]
): TopicStat[] {
  const groups = new Map<string, { topic: string; correct: number; total: number }>();

  questions.forEach((q, i) => {
    const key = q.topic.trim().toLowerCase();
    const group = groups.get(key) ?? { topic: q.topic.trim(), correct: 0, total: 0 };
    group.total += 1;
    if (answers[i]?.isCorrect) group.correct += 1;
    groups.set(key, group);
  });

  return Array.from(groups.values())
    .map((g) => ({
      ...g,
      percentage: Math.round((g.correct / g.total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage || b.total - a.total);
}

// Lowest-scoring topic, or null if every topic is 100%.
export function getWeakestTopic(stats: TopicStat[]): TopicStat | null {
  const weakest = stats[0];
  if (!weakest || weakest.percentage === 100) return null;
  return weakest;
}