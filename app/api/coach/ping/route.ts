// app/api/coach/ping/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sha256 } from "@/lib/security/hash";

/**
 * Minimal AI Coach isolation test route.
 * Requires x-service-key header matching a ServiceAccount.apiKeyHash.
 */

export async function GET(req: Request) {
  try {
    const key = req.headers.get("x-service-key") || "";
    if (!key) {
      return NextResponse.json(
        { error: "Missing service key" },
        { status: 401 }
      );
    }

    const hash = sha256(key);
    const sa = await prisma.serviceAccount.findFirst({
      where: { apiKeyHash: hash },
    });

    if (!sa) {
      return NextResponse.json(
        { error: "Invalid service key" },
        { status: 403 }
      );
    }

    await prisma.coachRequest.create({
      data: {
        serviceAccountId: sa.id,
        userId: null,
        inputHash: "ping",
        outputHash: "pong",
      },
    });

    return NextResponse.json({
      ok: true,
      serviceAccountId: sa.id,
    });
  } catch (error) {
    console.error("coach/ping error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
