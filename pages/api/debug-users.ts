import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.DATABASE_URL) {
    res
      .status(500)
      .json({ ok: false, error: "DATABASE_URL not set in environment" });
    return;
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, email, role FROM "User" ORDER BY id ASC LIMIT 20;`
      );
      res.status(200).json({ ok: true, users: result.rows });
    } finally {
      client.release();
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, error: err?.message || String(err) });
  }
}
