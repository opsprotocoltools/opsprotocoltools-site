import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding KnowledgeChunk records...");

  const knowledgeChunks = [
    {
      domain: "bridge",
      source: "system",
      priority: 10,
      tags: "bridge,theory,structure,ops",
      content:
        "Bridge = stable connective layer between people and systems. Track events chronologically, remove drama, preserve factual continuity.",
    },
    {
      domain: "bridge",
      source: "system",
      priority: 9,
      tags: "bridge,parenting,co-parenting",
      content:
        "In co-parenting, Bridge focuses on verifiable events affecting the child: handoffs, logistics, agreements, and environment quality.",
    },
    {
      domain: "phase-map",
      source: "system",
      priority: 10,
      tags: "phases,states,relationships",
      content:
        "Phase Map = discrete relational states. No story-writing. Identify current phase, constraints, and allowed moves without fantasy.",
    },
    {
      domain: "sunday-dump",
      source: "system",
      priority: 10,
      tags: "review,weekly,ops",
      content:
        "Sunday Dump = weekly factual recap. Inputs: events, decisions, tensions, wins. Outputs: status, risks, and next actions.",
    },
    {
      domain: "coach",
      source: "system",
      priority: 10,
      tags: "coach,ops,protocol",
      content:
        "Coach responds with concise, unemotional guidance: clarify facts, map to Bridge/Phase/Sunday layers, return concrete next actions.",
    },
  ];

  await prisma.knowledgeChunk.createMany({
    data: knowledgeChunks,
    skipDuplicates: true,
  });

  console.log("KnowledgeChunk seeding complete.");
}

main()
  .catch((error) => {
    console.error("Error seeding KnowledgeChunk:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
