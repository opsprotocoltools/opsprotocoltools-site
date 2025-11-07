import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, mode } = body;

    if (!input || !mode) {
      return NextResponse.json(
        { error: "Missing input or mode" },
        { status: 400 }
      );
    }

    // For now, simulate structured reasoning.
    const structured = {
      summary:
        mode === "bridge"
          ? "Event logged to Bridge Timeline."
          : mode === "phase"
          ? "Phase trend identified."
          : "Weekly synthesis recorded.",
      key_points: [
        "Data captured in prototype memory",
        "Awaiting deeper AI coach integration",
      ],
    };

    const reply = {
      id: Date.now(),
      role: "assistant",
      mode,
      content: `Acknowledged. Your ${mode} input has been captured and structured.`,
      structured,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      sessionId: Date.now(),
      reply,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error in coach route" },
      { status: 500 }
    );
  }
}
