// app/api/audit/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Internal endpoint for writing audit logs.
 * Protect via middleware / admin checks in production.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      role,
      action,
      route,
      ip,
      userAgent,
      metadata,
    } = body || {};

    if (!action) {
      return NextResponse.json(
        { error: "Missing 'action' field" },
        { status: 400 }
      );
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        role: role || "UNKNOWN",
        action,
        route: route || null,
        ip: ip || null,
        userAgent: userAgent || null,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audit POST error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
