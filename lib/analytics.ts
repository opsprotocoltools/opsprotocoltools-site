import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type AnalyticsMetadata = Prisma.InputJsonValue;

type LogEventOptions = {
  userId?: number | null;
  metadata?: AnalyticsMetadata;
};

/**
 * logEvent
 *
 * Minimal, schema-accurate analytics helper.
 * Persists rows into AnalyticsEvent:
 * - event: string (required)
 * - userId: number | null
 * - metadata: Json (object/array/primitive), defaults to {}.
 */
export async function logEvent(
  event: string,
  options: LogEventOptions = {}
): Promise<void> {
  if (!event || typeof event !== "string") {
    return;
  }

  const normalizedUserId =
    typeof options.userId === "number" && Number.isFinite(options.userId)
      ? options.userId
      : null;

  try {
    await prisma.analyticsEvent.create({
      data: {
        event,
        userId: normalizedUserId,
        metadata: (options.metadata ?? {}) as Prisma.InputJsonValue
      }
    });
  } catch (error) {
    // Analytics must never break the app.
    if (process.env.NODE_ENV === "development") {
      console.error("logEvent error:", error);
    }
  }
}
