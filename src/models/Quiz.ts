import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (v: string[]) => v.length === 4,
    },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    topic: { type: String, required: true },
  },
  { _id: false }
);

const AnswerSchema = new Schema(
  {
    questionIndex: { type: Number, required: true },
    selected: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    questionCount: { type: Number, required: true },
    questions: { type: [QuestionSchema], required: true },
    score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    answers: { type: [AnswerSchema], default: [] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

QuizSchema.index({ userId: 1, createdAt: -1 });

export type QuizDocument = InferSchemaType<typeof QuizSchema>;

const Quiz: Model<QuizDocument> =
  (mongoose.models.Quiz as Model<QuizDocument>) ||
  mongoose.model<QuizDocument>("Quiz", QuizSchema);

export default Quiz;
