// lib/coach/validator.ts

import { sha256 } from "@/lib/security/hash";

/**
 * Normalize and sanitize input text for the AI Coach.
 */

export function sanitizeCoachInput(raw: unknown): string {
  const text =
    typeof raw === "string" ? raw : JSON.stringify(raw ?? "", null, 2);
  return text.replace(/<script/gi, "[blocked-script]").trim();
}

/**
 * Hash a payload for logging without storing raw sensitive content.
 */
export function hashCoachPayload(payload: unknown): string {
  const text =
    typeof payload === "string"
      ? payload
      : JSON.stringify(payload ?? "", null, 2);
  return sha256(text);
}
