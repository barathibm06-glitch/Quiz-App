import Navbar from "./Navbar";

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl animate-pulse px-6 py-10">
        <div className="h-9 w-64 rounded-xl bg-card" />
        <div className="mt-3 h-4 w-48 rounded-lg bg-card" />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card" />
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-card" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-card" />
        </div>
      </main>
    </div>
  );
}