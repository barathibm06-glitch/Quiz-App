import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "barathiq_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  userId: string;
  name: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short (use at least 16 characters) in .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

// Call from route handlers only (cookies can't be set in pages).
export async function createSession(user: { id: string; name: string }) {
  const token = await new SignJWT({ name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getSecret(); // misconfiguration should fail loudly

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (!payload.sub || typeof payload.name !== "string") return null;
    return { userId: payload.sub, name: payload.name };
  } catch {
    return null; // expired or tampered token
  }
}

// For pages: sends logged-out visitors to /login and back afterwards.
export async function requireSession(nextPath: string): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}
