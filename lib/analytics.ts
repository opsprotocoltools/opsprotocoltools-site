// lib/analytics.ts

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AnalyticsMetadata = Prisma.InputJsonValue;

type LogEventParams = {
  userId?: number | null;
  metadata?: AnalyticsMetadata;
};

/**
 * Server-side analytics helper.
 * Persists events to the AnalyticsEvent table.
 */
export async function logEvent(
  type: string,
  params: LogEventParams = {}
): Promise<void> {
  const { userId = null, metadata } = params;

  await prisma.analyticsEvent.create({
    data: {
      type,
      userId,
      // Only set metadata when provided so types align with Prisma's NullableJson field
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
}
