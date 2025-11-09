import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Optional generic logging endpoint.
 * Not wired into auth flow yet, but ready for future use.
 *
 * POST /api/logEvent
 * Body: { userId, email, role, ip? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, role, ip } = body || {};

    if (!userId || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.loginEvent.create({
      data: {
        userId,
        email,
        role,
        ip: ip || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/logEvent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
