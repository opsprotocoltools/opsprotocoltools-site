import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function run() {
  const email = process.env.ADMIN_EMAIL || "opsprotocoltools@gmail.com";
  const plain = process.env.ADMIN_PASSWORD || "8y6jK321!@#!";

  console.log("Using DATABASE_URL:", process.env.DATABASE_URL);
  console.log("Checking admin user:", email);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log("Result: NO USER FOUND with that email.");
    return;
  }

  console.log("User record:", {
    id: user.id,
    email: user.email,
    role: (user as any).role,
    // do not print hash fully; just its presence and length
    hasPasswordHash: typeof (user as any).passwordHash === "string",
    hasHashedPassword: typeof (user as any).hashedPassword === "string",
    hasPassword: typeof (user as any).password === "string"
  });

  const anyUser = user as any;
  const hash: string | null =
    typeof anyUser.passwordHash === "string"
      ? anyUser.passwordHash
      : typeof anyUser.hashedPassword === "string"
      ? anyUser.hashedPassword
      : typeof anyUser.password === "string"
      ? anyUser.password
      : null;

  if (!hash) {
    console.log("Result: No usable password field on this user.");
    return;
  }

  const ok = await bcrypt.compare(plain, hash);

  console.log("Password matches ADMIN_PASSWORD?", ok);
}

run()
  .catch((e) => {
    console.error("check-admin error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
