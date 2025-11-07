// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "opsprotocoltools@gmail.com" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: "opsprotocoltools@gmail.com",
      name: "Ops Protocol Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin user seeded.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
