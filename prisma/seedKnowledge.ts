import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding KnowledgeChunk...");

  const knowledgeChunks = [
    {
      domain: "opsprotocoltools.com",
      source: "system",
      content: "Initial Ops Protocol structural data seed.",
    },
  ];

  for (const chunk of knowledgeChunks) {
    await prisma.knowledgeChunk.upsert({
      where: { id: chunk.id || 1 },
      update: {},
      create: chunk,
    });
  }

  console.log("KnowledgeChunk seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
