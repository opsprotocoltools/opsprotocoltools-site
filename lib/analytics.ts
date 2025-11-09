// lib/analytics.ts

import prisma from "./prisma";

/**
 * Server-side helper for logging analytics events directly via Prisma.
 * Use from server components / API routes only.
 */
export async function logAnalyticsEvent(options: {
  event: string;
  type?: string;
  userId?: number | null;
  metadata?: Record<string, any>;
}) {
  const event = options.event?.trim();
  if (!event) return;

  const type = options.type?.trim() || "event";
  const rawMetadata = options.metadata || {};

  const metadataString = JSON.stringify(rawMetadata);
  const metadata =
    metadataString.length > 4000
      ? { truncated: true }
      : rawMetadata;

  await prisma.analyticsEvent.create({
    data: {
      event,
      type,
      metadata,
      userId: options.userId ?? null,
    },
  });
}
