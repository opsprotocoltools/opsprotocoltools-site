// prisma/seedKnowledge.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type KnowledgeChunkInput = {
  domain: string;
  source: string;
  priority: number;
  tags: string;    // comma-separated
  content: string;
};

const chunks: KnowledgeChunkInput[] = [
  {
    domain: "coparenting",
    source: "Coparenting overview",
    priority: 1,
    tags: "coparenting,structure,child_outcomes",
    content:
      "Consistently calm, low-conflict coparenting with clear agreements improves stability, child outcomes, and reduces decision fatigue.",
  },
  {
    domain: "bridge",
    source: "Bridge Timeline principle",
    priority: 1,
    tags: "bridge_timeline,events,logging",
    content:
      "Bridge is a chronological log of concrete events, not feelings. Each entry captures what happened, when, who decided, and what changed.",
  },
  {
    domain: "phase",
    source: "Phase Map principle",
    priority: 1,
    tags: "phase_map,states,boundaries",
    content:
      "Phase labels describe the actual state of a relationship or system using observable behavior and commitments, not hopes or narratives.",
  },
  {
    domain: "sunday_dump",
    source: "Sunday Dump principle",
    priority: 1,
    tags: "sunday_dump,review,next_actions",
    content:
      "Sunday Dump is a weekly sweep that compresses the week into signals, lessons, and specific next moves.",
  },
];

async function main() {
  console.log("Seeding KnowledgeChunk...");

  for (const chunk of chunks) {
    await prisma.knowledgeChunk.upsert({
      where: {
        // unique by domain + source
        domain_source: {
          domain: chunk.domain,
          source: chunk.source,
        },
      },
      update: {
        priority: chunk.priority,
        tags: chunk.tags,
        content: chunk.content,
      },
      create: {
        domain: chunk.domain,
        source: chunk.source,
        priority: chunk.priority,
        tags: chunk.tags,
        content: chunk.content,
      },
    });
  }

  console.log("KnowledgeChunk seeding complete.");
}

main()
  .catch((e) => {
    console.error("SeedKnowledge error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
