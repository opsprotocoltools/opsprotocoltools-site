import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * System heartbeat endpoint.
 * Intended for cron or monitoring pings.
 *
 * POST /api/heartbeat
 * Body optional: { status?: string, details?: object }
 */
export async function POST(req: Request) {
  try {
    let status = "ok";
    let details: Record<string, any> = {};

    try {
      const body = await req.json().catch(() => null);
      if (body && typeof body === "object") {
        if (typeof body.status === "string") {
          status = body.status;
        }
        if (body.details && typeof body.details === "object") {
          details = body.details;
        }
      }
    } catch {
      // Ignore body parsing errors
    }

    await prisma.systemHeartbeat.create({
      data: {
        status,
        details
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/heartbeat failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple GET for manual checks.
 */
export async function GET() {
  try {
    const latest = await prisma.systemHeartbeat.findFirst({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      ok: true,
      latest
    });
  } catch (error) {
    console.error("GET /api/heartbeat failed:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
