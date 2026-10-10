import { Check, X } from "lucide-react";

export type ReviewItem = {
  number: number;
  question: string;
  selected: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
};

export default function AnswerReview({ items }: { items: ReviewItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.number}
          className={`rounded-2xl border p-5 sm:p-6 ${
            item.isCorrect
              ? "border-success/30 bg-success/5"
              : "border-danger/30 bg-danger/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                item.isCorrect
                  ? "bg-success/20 text-success"
                  : "bg-danger/20 text-danger"
              }`}
            >
              {item.isCorrect ? <Check size={14} /> : <X size={14} />}
            </span>
            <span
              className={`text-sm font-bold ${
                item.isCorrect ? "text-success" : "text-danger"
              }`}
            >
              Question {item.number}
            </span>
          </div>

          <p className="mt-3 font-semibold leading-snug">{item.question}</p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Your Answer
              </p>
              <p
                className={`mt-1 font-medium ${
                  item.isCorrect ? "text-success" : "text-danger"
                }`}
              >
                {item.selected}
              </p>
            </div>

            {!item.isCorrect && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Correct Answer
                </p>
                <p className="mt-1 font-medium text-success">
                  {item.correctAnswer}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Explanation
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-2">
              {item.explanation}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}