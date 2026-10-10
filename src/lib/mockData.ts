import type { Difficulty } from "@/types/quiz";

// Temporary data for Phase 5. Replaced with MongoDB data in Phase 9.

export const mockStats = {
  quizzes: 12,
  avgScore: 82,
  bestScore: 100,
  questions: 120,
};

export const mockRecentQuizzes: {
  id: string;
  title: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  percentage: number;
}[] = [
  {
    id: "1",
    title: "Python Functions",
    difficulty: "Medium",
    score: 8,
    total: 10,
    percentage: 80,
  },
  {
    id: "2",
    title: "SQL Joins",
    difficulty: "Hard",
    score: 7,
    total: 10,
    percentage: 70,
  },
  {
    id: "3",
    title: "JavaScript Arrays",
    difficulty: "Easy",
    score: 10,
    total: 10,
    percentage: 100,
  },
];

export const mockWeakTopics = [
  { topic: "Python Functions", percentage: 62 },
  { topic: "SQL Joins", percentage: 68 },
];
