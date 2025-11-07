"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function getBooks() {
  await requireAdmin();
  return prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookById(id: number) {
  await requireAdmin();
  return prisma.book.findUnique({ where: { id } });
}

export async function createBook(data: {
  title: string;
  slug: string;
  description?: string;
}) {
  await requireAdmin();
  return prisma.book.create({ data });
}

export async function updateBook(
  id: number,
  data: Partial<{ title: string; slug: string; description?: string }>
) {
  await requireAdmin();
  return prisma.book.update({ where: { id }, data });
}

export async function deleteBook(id: number) {
  await requireAdmin();
  return prisma.book.delete({ where: { id } });
}
