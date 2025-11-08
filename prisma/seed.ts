import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "opsprotocoltools@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "8y6jK321!@#!";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
      name: "Ops Protocol Admin",
    },
    create: {
      email,
      passwordHash,
      role: Role.ADMIN,
      name: "Ops Protocol Admin",
    },
  });

  console.log("Admin user seeded:", admin.email);
}

main()
  .catch((e) => {
    console.error("Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
