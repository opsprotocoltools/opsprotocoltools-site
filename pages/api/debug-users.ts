import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
      orderBy: { id: "asc" },
      take: 20,
    });

    res.status(200).json({ ok: true, users });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: (err as Error).message ?? "unknown error" });
  }
}
