// actions/adminActions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/lib/analytics";

export async function toggleUserRole(formData: FormData) {
  const admin = await requireAdmin();

  const id = Number(formData.get("userId"));
  if (!id || Number.isNaN(id)) return;

  // Prevent self-demotion
  if (id === admin.id) {
    throw new Error("Cannot modify your own admin role");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;

  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  await logEvent("admin.toggle_role", {
    userId: admin.id,
    metadata: {
      targetUserId: id,
      fromRole: user.role,
      toRole: newRole,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const admin = await requireAdmin();

  const id = Number(formData.get("userId"));
  if (!id || Number.isNaN(id)) return;

  // Prevent deleting yourself
  if (id === admin.id) {
    throw new Error("Cannot delete your own account");
  }

  await prisma.user.delete({
    where: { id },
  });

  await logEvent("admin.delete_user", {
    userId: admin.id,
    metadata: { targetUserId: id },
  });

  revalidatePath("/admin/users");
}
