type ProgressBarProps = {
  value: number; // 0–100
};

export default function ProgressBar({ value }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className="h-2 w-full rounded-full bg-surface"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}