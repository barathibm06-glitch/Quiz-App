import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-violet/40 hover:bg-card-hover">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet/30 to-cyan/20 text-violet-soft transition group-hover:text-cyan">
        <Icon size={22} />
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}