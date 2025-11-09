// lib/security/session.ts

import { sha256 } from "./hash";

/**
 * Session helpers. Works with JWT strategy as metadata helpers.
 */

export function buildSessionFingerprint(
  userId: number,
  userAgent: string | null,
  ip: string | null
): string {
  const base = `${userId}|${userAgent || ""}|${ip || ""}`;
  return sha256(base);
}

export function hashSessionToken(raw: string): string {
  return sha256(raw);
}
