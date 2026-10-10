import { Sparkles, SlidersHorizontal, Zap, Target } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Sparkles,
    title: "AI Generated",
    description: "Generate unique MCQs from any topic instantly.",
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Difficulty",
    description: "Choose Easy, Medium or Hard questions.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your score immediately after completing the quiz.",
  },
  {
    icon: Target,
    title: "Weak Topic Analysis",
    description: "Discover the areas you need to improve.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-soft">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to learn faster
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
