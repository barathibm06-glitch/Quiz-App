"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "signup";
  next: string;
};

export default function AuthForm({ mode, next }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextQuery = next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Network problem. Check your internet connection and try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-surface px-4 py-3.5 text-text placeholder:text-muted/70 outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-card/80 p-6 backdrop-blur-xl sm:p-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-text-2">
          {isSignup
            ? "Sign up to create AI quizzes and track your progress."
            : "Log in to access your quizzes and dashboard."}
        </p>
      </div>

      {isSignup && (
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : undefined}
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? "At least 8 characters" : "Your password"}
          className={inputClass}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? isSignup
            ? "Creating account..."
            : "Logging in..."
          : isSignup
            ? "Sign Up"
            : "Log In"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignup ? "Already have an account?" : "New to BarathIQ?"}{" "}
        <Link
          href={`${isSignup ? "/login" : "/signup"}${nextQuery}`}
          className="font-semibold text-violet-soft hover:text-violet-bright"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
