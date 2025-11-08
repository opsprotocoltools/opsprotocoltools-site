import { NextResponse } from "next/server";

type AnalyticsBody = {
  event?: string;
  userId?: number | string | null;
  metadata?: Record<string, any> | null;
};

/**
 * POST /api/analytics
 *
 * Goal:
 * - In real life: save analytics events to the database.
 * - During build or if anything is wrong: DO NOT crash, just return ok.
 */
export async function POST(req: Request) {
  try {
    // If there is no database configured, quietly succeed and skip.
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Read the JSON body from the request
    const body = (await req.json()) as AnalyticsBody;

    // Normalize userId to a number or null
    const rawUserId = body.userId;
    let normalizedUserId: number | null = null;

    if (rawUserId !== null && rawUserId !== undefined && rawUserId !== "") {
      const n = typeof rawUserId === "number" ? rawUserId : Number(rawUserId);
      normalizedUserId = Number.isNaN(n) ? null : n;
    }

    // Import prisma ONLY here, NOT at the top.
    const { default: prisma } = await import("@/lib/prisma");

    // Write the analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: body.event || "unknown",
        userId: normalizedUserId,
        metadata: body.metadata ?? {},
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // If anything breaks (including in build), do NOT throw.
    // We return ok so Next/Vercel stay happy.
    return NextResponse.json({ ok: true, skipped: true });
  }
}

/**
 * GET /api/analytics
 *
 * Simple health check so build/route probing never fails.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
