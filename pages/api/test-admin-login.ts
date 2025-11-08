import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = "opsprotocoltools@gmail.com";
    const password = "8y6jK321!@#!";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(200).json({ ok: false, reason: "no_user" });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      res.status(200).json({ ok: false, reason: "bad_password" });
      return;
    }

    res.status(200).json({
      ok: true,
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, error: err?.message || String(err) });
  }
}
