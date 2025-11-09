// lib/audit.ts

import prisma from "./prisma";

/**
 * Centralized audit logger.
 * Call this from sensitive flows (auth, admin actions, cron, etc).
 */
export async function logAudit(options: {
  userId?: number | null;
  role?: string | null;
  action: string;
  route?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}) {
  const action = options.action?.trim();
  if (!action) return;

  const role = options.role?.trim() || "SYSTEM";
  const metadata = options.metadata || {};

  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId ?? null,
        role,
        action,
        route: options.route || null,
        ip: options.ip || null,
        userAgent: options.userAgent || null,
        metadata,
      },
    });
  } catch (error) {
    // Never throw from audit logger; last-line safety.
    console.error("logAudit failed:", error);
  }
}
