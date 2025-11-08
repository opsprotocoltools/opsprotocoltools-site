import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// This route creates the first admin user.
// It can only be reached from your browser once, then you delete it.
export async function GET() {
  try {
    const email = "opsprotocoltools@gmail.com";
    const password = "8y6jK321!@#!";
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name: "Admin",
        role: "ADMIN",
      },
    });

    return NextResponse.json({ ok: true, message: "Admin user created." });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message });
  }
}
