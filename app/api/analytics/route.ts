import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const type = typeof body.type === "string" ? body.type.trim() : "";
    const metadata =
      body.metadata && typeof body.metadata === "object"
        ? body.metadata
        : undefined;

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type'." },
        { status: 400 }
      );
    }

    const userId =
      session && (session.user as any)?.id
        ? Number((session.user as any).id)
        : null;

    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        metadata: metadata ?? {},
        userId: Number.isNaN(userId) ? null : userId,
      },
    });

    return NextResponse.json({ ok: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { error: "Failed to log analytics event." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const events = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    );
  }
}
