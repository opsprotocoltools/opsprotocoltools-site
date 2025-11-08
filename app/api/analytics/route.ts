import { NextResponse } from "next/server";

type AnalyticsBody = {
  event?: string;
  userId?: number | string | null;
  metadata?: Record<string, any> | null;
};

/**
 * POST /api/analytics
 * Runtime: logs event.
 * Build / no DB: quietly skips.
 */
export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await req.json()) as AnalyticsBody;
    const rawUserId = body.userId;
    let normalizedUserId: number | null = null;

    if (rawUserId !== null && rawUserId !== undefined && rawUserId !== "") {
      const n = typeof rawUserId === "number" ? rawUserId : Number(rawUserId);
      normalizedUserId = Number.isNaN(n) ? null : n;
    }

    const { default: prisma } = await import("@/lib/prisma");

    await prisma.analyticsEvent.create({
      data: {
        event: body.event || "unknown",
        userId: normalizedUserId,
        metadata: body.metadata ?? {},
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, skipped: true });
  }
}

/**
 * GET /api/analytics
 * Health check for route probing.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
