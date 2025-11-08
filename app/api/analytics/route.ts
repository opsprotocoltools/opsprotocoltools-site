import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type AnalyticsBody = {
  event?: string;
  userId?: number | string | null;
  metadata?: Record<string, any> | null;
};

// TRUE only when Vercel is BUILDING the app, not when users are visiting it.
const isBuildPhase =
  !!process.env.VERCEL &&
  process.env.NEXT_PHASE === "phase-production-build";

/**
 * POST /api/analytics
 * Logs analytics events into the database.
 * Must NEVER break build, and must NEVER crash the site.
 */
export async function POST(req: Request) {
  try {
    // If we are building, or no database URL is set, say "ok" and do nothing.
    if (isBuildPhase || !process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await req.json()) as AnalyticsBody;

    const rawUserId = body.userId;
    let normalizedUserId: number | null = null;

    if (rawUserId !== null && rawUserId !== undefined && rawUserId !== "") {
      const n = typeof rawUserId === "number" ? rawUserId : Number(rawUserId);
      normalizedUserId = Number.isNaN(n) ? null : n;
    }

    await prisma.analyticsEvent.create({
      data: {
        event: body.event || "unknown",
        userId: normalizedUserId,
        metadata: body.metadata ?? {},
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // If something goes wrong, do NOT crash the app.
    return NextResponse.json({ ok: false });
  }
}

/**
 * GET /api/analytics
 * Simple "hello, I am alive" so Next.js/Vercel are happy.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
