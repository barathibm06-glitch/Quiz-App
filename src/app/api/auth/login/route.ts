import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import User from "@/models/User";

export const runtime = "nodejs";

// Used when the email doesn't exist, so both cases take similar time.
const DUMMY_HASH =
  "$2b$12$j74Ismy8FlDO3SR91ckkvO7ooYQSVstV0BfsP1BudHsGT.1n8O2Ka";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = loginSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: input.error.issues[0]?.message ?? "Invalid details." },
      { status: 400 }
    );
  }

  const { email, password } = input.data;

  try {
    await connectDB();

    const user = await User.findOne({ email }).lean();
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession({ id: user._id.toString(), name: user.name });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json(
      { error: "We couldn't log you in right now. Please try again." },
      { status: 500 }
    );
  }
}
