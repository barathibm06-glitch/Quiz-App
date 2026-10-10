import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { getSession } from "@/lib/auth";
import { safeNextPath } from "@/lib/redirect";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = safeNextPath(next);

  if (await getSession()) redirect(safeNext);

  return (
    <div className="min-h-screen bg-navy bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.25),transparent_45%)]">
      <Navbar />
      <main className="mx-auto w-full max-w-md px-6 py-14">
        <AuthForm mode="signup" next={safeNext} />
      </main>
    </div>
  );
}
