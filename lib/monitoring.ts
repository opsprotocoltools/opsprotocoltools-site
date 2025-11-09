"use server";

import prisma from "./prisma";

/**
 * Server-side error logger.
 */
export async function logErrorServer(options: {
  message: string;
  stack?: string;
  route?: string;
  userId?: number;
  context?: Record<string, any>;
}) {
  const { message, stack, route, userId, context } = options;

  if (!message) {
    return;
  }

  try {
    await prisma.errorEvent.create({
      data: {
        message,
        stack: stack || null,
        route: route || null,
        userId: userId || undefined,
        context: context || {}
      }
    });
  } catch (error) {
    console.error("logErrorServer failed:", error);
  }
}

/**
 * Client-side error logger using /api/error.
 */
export async function logErrorClient(options: {
  message: string;
  stack?: string;
  route?: string;
  context?: Record<string, any>;
}) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await fetch("/api/error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    });
  } catch (error) {
    console.error("logErrorClient failed:", error);
  }
}

/**
 * Server-side heartbeat writer.
 * Call from cron or manual health check.
 */
export async function writeHeartbeat(options?: {
  status?: string;
  details?: Record<string, any>;
}) {
  try {
    await prisma.systemHeartbeat.create({
      data: {
        status: options?.status || "ok",
        details: options?.details || {}
      }
    });
  } catch (error) {
    console.error("writeHeartbeat failed:", error);
  }
}
