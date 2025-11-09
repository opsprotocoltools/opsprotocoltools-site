// app/api/analytics/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, requireAdmin } from "@/lib/auth";

/**
 * POST /api/analytics
 * Lightweight logger for client and server events.
 *
 * Request body JSON:
 * {
 *   "event": "string",            // required
 *   "type": "string",             // optional, e.g. "pageview" | "action" | "error"
 *   "metadata": { ... }           // optional, must be JSON-serializable
 * }
 *
 * Associates event with current authenticated user if present.
 */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));

    const event = typeof body.event === "string" ? body.event.trim() : "";
    const type =
      typeof body.type === "string" && body.type.trim().length > 0
        ? body.type.trim()
        : "event";
    const rawMetadata =
      body.metadata && typeof body.metadata === "object"
        ? body.metadata
        : {};

    if (!event) {
      return NextResponse.json(
        { error: "Missing 'event' string" },
        { status: 400 }
      );
    }

    // Hard limit metadata size to keep table sane.
    const metadataString = JSON.stringify(rawMetadata);
    const metadata =
      metadataString.length > 4000
        ? { truncated: true }
        : rawMetadata;

    await prisma.analyticsEvent.create({
      data: {
        event,
        type,
        metadata,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics
 * Admin-only view of recent analytics events (for API / programmatic use).
 */

export async function GET() {
  try {
    await requireAdmin();

    const events = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    const status = error?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { error: "Not allowed" },
      { status }
    );
  }
}
