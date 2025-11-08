import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const rawId =
      session && (session.user as any)?.id
        ? (session.user as any).id
        : null;

    const userId =
      rawId !== null && !Number.isNaN(Number(rawId))
        ? Number(rawId)
        : null;

    const body = await req.json();
    const { event, metadata } = body ?? {};

    if (!event || typeof event !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'event' field" },
        { status: 400 }
      );
    }

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        event,
        userId,
        metadata: metadata ?? {}
      }
    });

    return NextResponse.json({ success: true, result: analyticsEvent });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
