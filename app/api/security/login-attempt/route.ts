// app/api/security/login-attempt/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Records login attempts.
 * Optionally used alongside Credentials authorize logic.
 */

export async function POST(req: Request) {
  try {
    const { email, ip, success, userId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing 'email'" },
        { status: 400 }
      );
    }

    await prisma.loginAttempt.create({
      data: {
        email,
        ip: ip || null,
        success: Boolean(success),
        userId: userId ?? null,
      },
    });

    const since = new Date(Date.now() - 15 * 60 * 1000);
    const recentFails = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: since },
      },
    });

    return NextResponse.json({
      locked: recentFails >= 5,
    });
  } catch (error) {
    console.error("login-attempt error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
