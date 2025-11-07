// prisma/seed.ts

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "opsprotocoltools@gmail.com";
  const plainPassword = "8y6jK321!@#!";

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Ensure a single canonical admin user
  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Ops Protocol Admin",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email,
      name: "Ops Protocol Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("Seeded admin:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
