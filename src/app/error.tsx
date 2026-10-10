"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Details stay in the console; the student only sees a friendly message.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <AlertCircle size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Oops! Something went wrong.</h1>
        <p className="mt-3 text-text-2">
          We couldn&apos;t load this page right now. Please try again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110"
          >
            Try Again
          </button>
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