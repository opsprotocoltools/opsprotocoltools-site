"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}

/**
 * Toggle a user's role between USER and ADMIN.
 */
export async function toggleUserAdmin(userId: number) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  await prisma.user.update({
    where: { id: userId },
    data: { role: nextRole },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

/**
 * Permanently delete a user.
 */
export async function deleteUser(userId: number) {
  await requireAdmin();

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
