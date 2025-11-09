// app/api/security/service-account/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateApiKey, sha256 } from "@/lib/security/hash";
import { requireAdmin } from "@/lib/auth";

/**
 * Create a new ServiceAccount + API key for internal services (e.g. AI Coach).
 * Only callable by ADMIN users.
 */

export async function POST() {
  try {
    await requireAdmin();

    const apiKey = generateApiKey();
    const hash = sha256(apiKey);

    const sa = await prisma.serviceAccount.create({
      data: {
        name: "AI Coach",
        apiKeyHash: hash,
        role: "SERVICE",
      },
    });

    return NextResponse.json({
      success: true,
      id: sa.id,
      apiKey,
    });
  } catch (error: any) {
    console.error("service-account error:", error);
    const status = error?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { error: "Server error" },
      { status }
    );
  }
}
