// lib/analytics.ts

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AnalyticsMetadata = Prisma.JsonValue;

type LogEventParams = {
  userId?: number | null;
  metadata?: AnalyticsMetadata;
};

/**
 * Minimal server-side analytics helper.
 * Writes to AnalyticsEvent table.
 */
export async function logEvent(
  type: string,
  params: LogEventParams = {}
) {
  const { userId = null, metadata = {} } = params;

  await prisma.analyticsEvent.create({
    data: {
      type,
      userId,
      metadata,
    },
  });
}
