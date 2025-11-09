// lib/security/mfa.ts

import { sha256 } from "./hash";

/**
 * MFA utilities stub.
 * You can plug in a real TOTP library later (otplib, speakeasy, etc.).
 */

export function deriveMfaStorageKey(userId: number): string {
  return sha256(`ops-mfa-${userId}`);
}

/**
 * Placeholder verifier: always returns true if MFA is disabled.
 * When you enable real TOTP, replace logic here.
 */
export function verifyMfaTokenIfEnabled(
  mfaEnabled: boolean,
  _storedSecret: string | null,
  _token: string | null
): boolean {
  if (!mfaEnabled) return true;
  // Implement real check when you wire TOTP.
  return false;
}
