import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Generic error logging endpoint for client-side or external callers.
 *
 * POST /api/error
 * Body: { message: string, stack?: string, route?: string, userId?: number, context?: object }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      stack,
      route,
      userId,
      context
    }: {
      message?: string;
      stack?: string;
      route?: string;
      userId?: number;
      context?: Record<string, any>;
    } = body || {};

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' field" },
        { status: 400 }
      );
    }

    await prisma.errorEvent.create({
      data: {
        message,
        stack: stack || null,
        route: route || null,
        userId: userId || undefined,
        context: context || {}
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/error failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
