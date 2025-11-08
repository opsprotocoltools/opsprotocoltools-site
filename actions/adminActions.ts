"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

/**
 * Update a user's role.
 * Prevents an admin from demoting their own account.
 */
export async function updateUserRole(id: number, role: Role) {
  const session = await getServerSession(authOptions);
  const adminUser = (session?.user as any) || {};

  if (!adminUser?.id) {
    throw new Error("Unauthorized");
  }

  // Prevent self-demotion
  if (Number(id) === Number(adminUser.id)) {
    throw new Error("Cannot modify your own admin role");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role }
  });

  return updatedUser;
}

/**
 * Delete a user.
 * Prevents deleting yourself.
 */
export async function deleteUser(id: number) {
  const session = await getServerSession(authOptions);
  const adminUser = (session?.user as any) || {};

  if (!adminUser?.id) {
    throw new Error("Unauthorized");
  }

  if (Number(id) === Number(adminUser.id)) {
    throw new Error("Cannot delete your own account");
  }

  await prisma.user.delete({
    where: { id }
  });

  return { success: true };
}
