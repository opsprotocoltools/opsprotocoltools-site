import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@opsprotocoltools.com" },
    update: {},
    create: {
      email: "admin@opsprotocoltools.com",
      passwordHash,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin user seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
