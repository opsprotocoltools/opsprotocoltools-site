import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Accept both shapes: { event } or { type }
    const event =
      typeof body.event === "string"
        ? body.event
        : typeof body.type === "string"
        ? body.type
        : "unknown";

    const rawUserId = body.userId;
    const userId =
      typeof rawUserId === "number"
        ? rawUserId
        : typeof rawUserId === "string" && rawUserId.trim() !== ""
        ? Number.isNaN(Number(rawUserId))
          ? null
          : Number(rawUserId)
        : null;

    const metadata =
      body && typeof body.metadata === "object" && body.metadata !== null
        ? body.metadata
        : {};

    await prisma.analyticsEvent.create({
      data: {
        event,
        userId,
        metadata,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never break the app because of analytics
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  // Optional: simple health check
  return NextResponse.json({ ok: true });
}
