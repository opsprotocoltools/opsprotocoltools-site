// app/api/cron/heartbeat/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

/**
 * Heartbeat endpoint.
 *
 * Used by:
 * - Local dev: manual hits or a simple loop.
 * - Production: Vercel cron calling /api/cron/heartbeat.
 *
 * Protection:
 * - If CRON_SECRET is set, requires header x-cron-key == CRON_SECRET.
 */

async function runHeartbeat() {
  const startedAt = Date.now();

  // Simple DB check: if this fails, catch below.
  await prisma.user.count();

  const elapsedMs = Date.now() - startedAt;

  // Record heartbeat row
  const hb = await prisma.heartbeat.create({
    data: {
      type: "cron",
      ok: true,
      message: `OK in ${elapsedMs}ms`,
    },
  });

  // Audit trail
  await logAudit({
    action: "HEARTBEAT_OK",
    role: "SYSTEM",
    route: "/api/cron/heartbeat",
    metadata: {
      heartbeatId: hb.id,
      elapsedMs,
    },
  });

  return {
    ok: true,
    elapsedMs,
    heartbeatId: hb.id,
  };
}

export async function GET(req: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret && secret.length > 0) {
      const key = req.headers.get("x-cron-key");
      if (key !== secret) {
        return NextResponse.json(
          { error: "Unauthorized cron" },
          { status: 401 }
        );
      }
    }

    const result = await runHeartbeat();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("HEARTBEAT_FAIL:", error);

    try {
      await prisma.heartbeat.create({
        data: {
          type: "cron",
          ok: false,
          message: error?.message || "Unknown error",
        },
      });

      await logAudit({
        action: "HEARTBEAT_FAIL",
        role: "SYSTEM",
        route: "/api/cron/heartbeat",
        metadata: {
          message: error?.message || "Unknown",
        },
      });
    } catch (inner) {
      console.error("Failed to record heartbeat failure:", inner);
    }

    return NextResponse.json(
      { ok: false, error: "Heartbeat error" },
      { status: 500 }
    );
  }
}
