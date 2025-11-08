import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type AnalyticsBody = {
  event?: string;
  userId?: number | string | null;
  metadata?: Record<string, any> | null;
};

// Treat Vercel production build as "no-op analytics" to avoid failing builds
const isBuildPhase =
  !!process.env.VERCEL &&
  (process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "production");

/**
 * POST /api/analytics
 * Used by the app to log analytics events.
 * Must NEVER break builds or the app if the DB is unavailable.
 */
export async function POST(req: Request) {
  try {
    // During build or if DATABASE_URL is not set, skip writing to DB.
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
    // Swallow errors: analytics must not crash anything
    return NextResponse.json({ ok: false });
  }
}

/**
 * GET /api/analytics
 * Simple health check / noop.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
