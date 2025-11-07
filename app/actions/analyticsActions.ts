"use server";

import { prisma } from "@/lib/prisma";

export async function logEvent(data: {
  userId?: number;
  type: string;
  metadata?: Record<string, any>;
}) {
  try {
    return await prisma.analyticsEvent.create({
      data: {
        userId: data.userId,
        type: data.type,
        metadata: data.metadata ?? {},
      },
    });
  } catch (err) {
    console.error("Failed to log event:", err);
    return null;
  }
}

export async function getRecentEvents(limit = 50) {
  return prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
