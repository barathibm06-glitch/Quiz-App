export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionCount = 5 | 10 | 15;

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface GenerateQuizInput {
  topic: string;
  difficulty: Difficulty;
  questionCount: QuestionCount;
}

export interface GeneratedQuiz {
  title: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface QuizAnswer {
  questionIndex: number;
  selected: string;
  isCorrect: boolean;
}

export interface Quiz extends GeneratedQuiz {
  _id: string;
  questionCount: number;
  score: number;
  percentage: number;
  answers: QuizAnswer[];
  completed: boolean;
  createdAt: string;
}