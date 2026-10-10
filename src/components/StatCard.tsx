import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 transition hover:bg-card-hover">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-muted">
          {label}
        </span>
        <Icon size={18} className="text-violet-soft" />
      </div>
      <p className="mt-4 font-heading text-3xl font-bold">{value}</p>
    </div>
  );
}
