"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function getTools() {
  await requireAdmin();
  return prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getToolById(id: number) {
  await requireAdmin();
  return prisma.tool.findUnique({ where: { id } });
}

export async function createTool(data: {
  name: string;
  slug: string;
  description?: string;
  url?: string;
}) {
  await requireAdmin();
  return prisma.tool.create({ data });
}

export async function updateTool(
  id: number,
  data: Partial<{ name: string; slug: string; description?: string; url?: string }>
) {
  await requireAdmin();
  return prisma.tool.update({ where: { id }, data });
}

export async function deleteTool(id: number) {
  await requireAdmin();
  return prisma.tool.delete({ where: { id } });
}
