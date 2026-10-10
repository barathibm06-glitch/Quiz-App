import { Check } from "lucide-react";

type QuestionCardProps = {
  number: number;
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
};

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  number,
  question,
  options,
  selected,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/80 p-6 backdrop-blur-xl sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-soft">
        Question {number}
      </p>
      <h2 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">
        {question}
      </h2>

      <div className="mt-8 space-y-3">
        {options.map((option, i) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition disabled:cursor-not-allowed ${
                isSelected
                  ? "border-violet bg-violet/10"
                  : "border-white/10 bg-surface hover:border-violet/40 hover:bg-card-hover"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  isSelected
                    ? "bg-violet text-white"
                    : "bg-white/5 text-text-2"
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1">{option}</span>
              {isSelected && (
                <Check size={18} className="shrink-0 text-violet-soft" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}