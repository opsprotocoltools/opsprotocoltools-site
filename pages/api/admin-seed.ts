import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const email = "opsprotocoltools@gmail.com";
    const password = "8y6jK321!@#!";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name: "Admin",
        role: "ADMIN",
      },
    });

    res.status(200).json({ ok: true, message: "Admin user ensured", id: user.id });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: (err as Error).message ?? "unknown error" });
  }
}
