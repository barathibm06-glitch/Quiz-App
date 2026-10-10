"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

type NavbarClientProps = {
  user: { name: string } | null;
};

export default function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    close();
    router.push("/");
    router.refresh();
  }

  const linkClass = "transition hover:text-text";
  const mobileLinkClass =
    "rounded-xl px-4 py-3 text-text-2 transition hover:bg-white/5 hover:text-text";
  const primaryButton =
    "rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet/20 transition hover:brightness-110";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-navy/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={close}
          className="font-heading text-xl font-bold tracking-tight"
        >
          <span className="text-violet-soft">✦</span> Barath
          <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">
            IQ
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 text-sm text-text-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className={linkClass}>
                Dashboard
              </Link>
              <Link href="/quiz/create" className={linkClass}>
                Create Quiz
              </Link>
              <span className="text-muted">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 transition hover:text-text"
              >
                <LogOut size={16} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
              <Link href="/signup" className={primaryButton}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-text-2 transition hover:bg-white/5 hover:text-text md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <p className="px-4 pb-1 text-sm text-muted">{user.name}</p>
                <Link href="/dashboard" onClick={close} className={mobileLinkClass}>
                  Dashboard
                </Link>
                <Link href="/quiz/create" onClick={close} className={mobileLinkClass}>
                  Create Quiz
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${mobileLinkClass} text-left`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className={mobileLinkClass}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="mt-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-3 text-center font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
