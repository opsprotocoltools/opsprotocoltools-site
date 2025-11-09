import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds knowledge chunks used for internal documentation / testing.
 */

const knowledgeChunks = [
  {
    title: "Ops Protocol Tools Overview",
    domain: "ops-protocol",
    source: "seed",
    priority: 1,
    tags: "overview,system,admin",
    content:
      "High-level description of the Ops Protocol Tools platform: Next.js 14, Prisma, NextAuth, PostgreSQL, Vercel."
  },
  {
    title: "Admin Login and Roles",
    domain: "auth",
    source: "seed",
    priority: 2,
    tags: "auth,admin,roles",
    content:
      "Initial admin account seeded with a fixed email and password. Role=ADMIN controls access to /admin routes."
  },
  {
    title: "Analytics Event Logging",
    domain: "analytics",
    source: "seed",
    priority: 3,
    tags: "analytics,events,logging",
    content:
      "AnalyticsEvent records track page views and actions and are visible in the /admin/analytics dashboard."
  },
  {
    title: "Books Registry",
    domain: "books",
    source: "seed",
    priority: 4,
    tags: "books,registry",
    content:
      "Book records represent Ops Protocol titles managed via /admin/books and used in the publishing pipeline."
  },
  {
    title: "Tools Registry",
    domain: "tools",
    source: "seed",
    priority: 5,
    tags: "tools,registry",
    content:
      "Tool records define Ops Protocol utilities like Bridge Timeline Manager, Phase Chart Dashboard, Sunday Dump Console."
  }
];

async function main() {
  if (knowledgeChunks.length === 0) {
    console.log("No knowledge chunks to seed.");
    return;
  }

  await prisma.knowledgeChunk.createMany({
    data: knowledgeChunks,
    skipDuplicates: true
  });

  console.log(`✅ Seeded ${knowledgeChunks.length} knowledge chunks.`);
}

main()
  .catch((error) => {
    console.error("SeedKnowledge error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
