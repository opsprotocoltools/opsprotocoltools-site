import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res
      .status(500)
      .json({ ok: false, error: "DATABASE_URL not set in environment" });
    return;
  }

  const email = "opsprotocoltools@gmail.com";
  const password = "8y6jK321!@#!";

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        INSERT INTO "User" (email, "passwordHash", name, role, "createdAt", "updatedAt")
        VALUES ($1, $2, 'Admin', 'ADMIN', NOW(), NOW())
        ON CONFLICT (email)
        DO UPDATE SET
          "passwordHash" = EXCLUDED."passwordHash",
          role = 'ADMIN',
          "updatedAt" = NOW()
        RETURNING id, email, role;
        `,
        [email, passwordHash]
      );

      res.status(200).json({
        ok: true,
        message: "Admin user ensured",
        user: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, error: err?.message || String(err) });
  }
}
