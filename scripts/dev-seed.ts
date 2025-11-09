// scripts/dev-seed.ts
//
// Dev-only seeding script for Ops Protocol Tools Site.
// Populates:
// - Admin user
// - Standard demo user
// - Sample books, tools, knowledge chunks
// - Sample analytics events
// - Sample audit logs
// - Sample heartbeats
// - One ServiceAccount (prints its API key for local testing)
//
// Usage (from project root):
//   npx ts-node scripts/dev-seed.ts
//
// Requirements:
//   - NODE_ENV !== "production"
//   - DATABASE_URL set and reachable
//   - npm install -D ts-node
//   - npm install bcryptjs

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "production") {
  throw new Error("Do not run scripts/dev-seed.ts in production.");
}

const prisma = new PrismaClient();

async function main() {
  const adminEmail =
    process.env.ADMIN_EMAIL || "opsprotocoltools@gmail.com";
  const adminPassword =
    process.env.ADMIN_PASSWORD || "8y6jK321!@#!";

  // ---------- Admin user ----------

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      mfaEnabled: false,
    },
    create: {
      email: adminEmail,
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      name: "Ops Admin",
      mfaEnabled: false,
    },
  });

  // ---------- Demo user ----------

  const demoPasswordHash = await bcrypt.hash("demo_password_123", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@opsprotocoltools.com" },
    update: {},
    create: {
      email: "demo@opsprotocoltools.com",
      role: Role.USER,
      passwordHash: demoPasswordHash,
      name: "Demo User",
      mfaEnabled: false,
    },
  });

  // ---------- Books ----------

  await prisma.book.upsert({
    where: { slug: "ops-protocol-core" },
    update: {
      description: "Core Ops Protocol system specification.",
    },
    create: {
      title: "Ops Protocol Core",
      slug: "ops-protocol-core",
      description: "Core Ops Protocol system specification.",
    },
  });

  await prisma.book.upsert({
    where: { slug: "ops-protocol-tools" },
    update: {
      description: "Ops Protocol Tools reference and admin guide.",
    },
    create: {
      title: "Ops Protocol Tools",
      slug: "ops-protocol-tools",
      description: "Ops Protocol Tools reference and admin guide.",
    },
  });

  // ---------- Tools ----------

  await prisma.tool.upsert({
    where: { slug: "ops-admin-console" },
    update: {
      description: "Secure admin console for Ops Protocol.",
    },
    create: {
      title: "Ops Admin Console",
      slug: "ops-admin-console",
      description: "Secure admin console for Ops Protocol.",
    },
  });

  await prisma.tool.upsert({
    where: { slug: "ops-analytics" },
    update: {
      description: "Analytics and observability module for Ops Protocol.",
    },
    create: {
      title: "Ops Analytics",
      slug: "ops-analytics",
      description: "Analytics and observability module for Ops Protocol.",
    },
  });

  // ---------- Knowledge Chunks (minimal samples) ----------

  const kcCount = await prisma.knowledgeChunk.count();
  if (kcCount === 0) {
    await prisma.knowledgeChunk.createMany({
      data: [
        {
          domain: "ops-protocol",
          source: "seed",
          priority: 10,
          tags: "core,protocol",
          content: "Ops Protocol defines structured operations and logging.",
        },
        {
          domain: "ops-tools",
          source: "seed",
          priority: 8,
          tags: "tools,admin",
          content:
            "Ops Protocol Tools provide admin dashboards and observability.",
        },
      ],
    });
  }

  // ---------- Analytics Events (sample) ----------

  const existingAnalytics = await prisma.analyticsEvent.count();
  if (existingAnalytics === 0) {
    await prisma.analyticsEvent.createMany({
      data: [
        {
          event: "admin_login_success",
          type: "auth",
          metadata: { seed: true, email: admin.email },
        },
        {
          event: "dashboard_view",
          type: "pageview",
          metadata: { seed: true, route: "/admin" },
        },
      ],
    });
  }

  // ---------- Audit Logs (sample) ----------

  const existingAudit = await prisma.auditLog.count();
  if (existingAudit === 0) {
    await prisma.auditLog.createMany({
      data: [
        {
          userId: admin.id,
          role: "ADMIN",
          action: "SEED_INIT",
          route: "scripts/dev-seed",
          ip: "127.0.0.1",
          userAgent: "seed-script",
          metadata: { message: "Initial dev seed executed." },
        },
        {
          userId: admin.id,
          role: "ADMIN",
          action: "CREATE_SAMPLE_DATA",
          route: "scripts/dev-seed",
          ip: "127.0.0.1",
          userAgent: "seed-script",
          metadata: { books: true, tools: true },
        },
      ],
    });
  }

  // ---------- Heartbeats (sample) ----------

  const hbCount = await prisma.heartbeat.count();
  if (hbCount === 0) {
    await prisma.heartbeat.create({
      data: {
        type: "seed",
        ok: true,
        message: "Initial heartbeat from dev seed.",
      },
    });
  }

  // ---------- Service Account for AI Coach (dev-only) ----------

  const existingService = await prisma.serviceAccount.findFirst({
    where: { name: "AI Coach Dev" },
  });

  if (!existingService) {
    const rawKey = `dev_coach_${Math.random()
      .toString(36)
      .slice(2)}_${Date.now()}`;

    const crypto = await import("crypto");
    const apiKeyHash = crypto
      .createHash("sha256")
      .update(rawKey)
      .digest("hex");

    await prisma.serviceAccount.create({
      data: {
        name: "AI Coach Dev",
        apiKeyHash,
        role: "SERVICE",
      },
    });

    // eslint-disable-next-line no-console
    console.log(
      "\n[DEV SERVICE ACCOUNT] AI Coach Dev key (store locally, not in code):"
    );
    // eslint-disable-next-line no-console
    console.log(rawKey);
  }

  // ---------- Summary ----------

  // eslint-disable-next-line no-console
  console.log("\n[DEV SEED] Completed successfully.");
  // eslint-disable-next-line no-console
  console.log(
    `Admin: ${admin.email} / (password from ADMIN_PASSWORD env or default seed)`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Demo user: demo@opsprotocoltools.com / demo_password_123`
  );
}

main()
  .catch((e) => {
    console.error("[DEV SEED] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
