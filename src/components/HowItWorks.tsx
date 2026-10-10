const steps = [
  {
    number: "01",
    title: "Choose a Topic",
    description: "Type any subject you want to be quizzed on.",
  },
  {
    number: "02",
    title: "Let AI Generate",
    description: "Get a fresh set of questions in seconds.",
  },
  {
    number: "03",
    title: "Test & Improve",
    description: "Take the quiz and see exactly what to revisit.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-surface/60 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-soft">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Three simple steps
          </h2>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.number} className="text-center md:text-left">
              <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-5xl font-bold text-transparent">
                {s.number}
              </span>
              <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
