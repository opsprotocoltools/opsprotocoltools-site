import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

/**
 * Master seed:
 * - Ensure primary admin user
 * - Seed sample Books
 * - Seed sample Tools
 * - Seed one AnalyticsEvent to verify logging
 *
 * Admin credentials:
 *   Email:    opsprotocoltools@gmail.com
 *   Password: 8y6jK321!@#!
 */
async function main() {
  const email = "opsprotocoltools@gmail.com";
  const password = "8y6jK321!@#!";

  const passwordHash = await hash(password, 10);

  // 1) Admin user
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
      name: "Ops Protocol Admin"
    },
    create: {
      email,
      passwordHash,
      role: Role.ADMIN,
      name: "Ops Protocol Admin"
    }
  });

  console.log("✅ Admin user ensured:", admin.email);

  // 2) Books
  const booksData = [
    {
      title: "Ops Protocol Tools Handbook",
      slug: "ops-protocol-tools-handbook",
      description:
        "Core reference for the Ops Protocol Tools system and admin console."
    },
    {
      title: "Ops Protocol V4 Playbook",
      slug: "ops-protocol-v4-playbook",
      description:
        "Structured playbook for Bridge Timeline, Phase Chart, and Sunday Dump."
    }
  ];

  for (const book of booksData) {
    const saved = await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        description: book.description
      },
      create: {
        title: book.title,
        slug: book.slug,
        description: book.description
      }
    });
    console.log("📘 Book ensured:", saved.slug);
  }

  // 3) Tools
  const toolsData = [
    {
      title: "Bridge Timeline Manager",
      slug: "bridge-timeline-manager",
      description:
        "Manage chronological Ops events, syncs, and state transitions."
    },
    {
      title: "Phase Chart Dashboard",
      slug: "phase-chart-dashboard",
      description:
        "View and adjust relationship / system phase states over time."
    },
    {
      title: "Sunday Dump Console",
      slug: "sunday-dump-console",
      description:
        "Capture and review weekly Ops summaries, action items, and integrity checks."
    }
  ];

  for (const tool of toolsData) {
    const saved = await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        title: tool.title,
        description: tool.description
      },
      create: {
        title: tool.title,
        slug: tool.slug,
        description: tool.description
      }
    });
    console.log("🛠️ Tool ensured:", saved.slug);
  }

  // 4) Initial analytics event (verifies AnalyticsEvent wiring)
  await prisma.analyticsEvent.create({
    data: {
      event: "admin_seeded",
      type: "system",
      userId: admin.id,
      metadata: {
        note: "Initial seed completed",
        source: "prisma/seed.ts"
      }
    }
  });

  console.log("📊 AnalyticsEvent recorded: admin_seeded");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
