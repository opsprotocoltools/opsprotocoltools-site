import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ApiEvent = {
  id: number;
  event: string;
  userEmail: string | null;
  userId: number | null;
  createdAt: string;
};

// Detect Vercel build / no-DB conditions so builds never break
const isBuildPhase =
  !!process.env.VERCEL &&
  (process.env.NEXT_PHASE === "phase-production-build");

export async function GET() {
  try {
    // During build or if DB is misconfigured, respond with empty data
    if (isBuildPhase || !process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, events: [] as ApiEvent[] });
    }

    const events = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const payload: ApiEvent[] = events.map((e) => ({
      id: e.id,
      event: e.event || "unknown",
      userEmail: e.user?.email ?? null,
      userId: e.userId ?? null,
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, events: payload });
  } catch (error) {
    // Do not kill the app; surface a safe error
    return NextResponse.json(
      { ok: false, error: "ANALYTICS_QUERY_FAILED" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ApiEvent = {
  id: number;
  event: string;
  userEmail: string | null;
  userId: number | null;
  createdAt: string;
};

// Detect Vercel build / no-DB conditions so builds never break
const isBuildPhase =
  !!process.env.VERCEL &&
  (process.env.NEXT_PHASE === "phase-production-build");

export async function GET() {
  try {
    // During build or if DB is misconfigured, respond with empty data
    if (isBuildPhase || !process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, events: [] as ApiEvent[] });
    }

    const events = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const payload: ApiEvent[] = events.map((e) => ({
      id: e.id,
      event: e.event || "unknown",
      userEmail: e.user?.email ?? null,
      userId: e.userId ?? null,
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, events: payload });
  } catch (error) {
    // Do not kill the app; surface a safe error
    return NextResponse.json(
      { ok: false, error: "ANALYTICS_QUERY_FAILED" },
      { status: 500 }
    );
  }
}
