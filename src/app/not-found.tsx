import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 text-center">
        <p className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-6xl font-bold text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-text-2">
          The page or quiz you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-text-2 transition hover:bg-white/10 hover:text-text"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}