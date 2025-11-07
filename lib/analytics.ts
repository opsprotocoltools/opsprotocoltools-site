// lib/analytics.ts

import { prisma } from "./prisma";

/**
 * Tiny helper to log operational events.
 * Safe to call anywhere; failures are swallowed and logged to console.
 */
export async function logEvent(
  type: string,
  options?: {
    userId?: number | null;
    metadata?: unknown;
  }
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        userId:
          typeof options?.userId === "number"
            ? options.userId
            : options?.userId ?? null,
        metadata:
          typeof options?.metadata === "undefined"
            ? null
            : (options.metadata as any),
      },
    });
  } catch (err) {
    // Do not break the app if analytics fails.
    console.error("Failed to log analytics event:", err);
  }
}
