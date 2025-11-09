// lib/security/hash.ts

import crypto from "crypto";

/**
 * Hash arbitrary string with SHA-256.
 */
export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Generate a random API key string.
 * Only store its SHA-256 hash in the database.
 */
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
