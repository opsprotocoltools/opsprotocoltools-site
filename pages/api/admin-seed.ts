import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Use Vercel DATABASE_URL directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Bcrypt hash for password: 8y6jK321!@#!
const ADMIN_HASH =
  "$2b$10$kEfW1EnuSZWJS2P/Rsgrlu6Cn0APZ6EvpRlOKQutety2akMbzdBp.";

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

  try {
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
        [email, ADMIN_HASH]
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
    res.status(500).json({
      ok: false,
      error: err?.message || String(err),
    });
  }
}
