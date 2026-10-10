import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/quizStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to view your quizzes." },
      { status: 401 }
    );
  }

  try {
    const data = await getDashboardData(session.userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[quizzes]", error);
    return NextResponse.json(
      { error: "We couldn't load your quizzes right now." },
      { status: 500 }
    );
  }
}
