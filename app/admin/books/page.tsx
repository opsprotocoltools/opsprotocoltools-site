import React from "react";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getBooksSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return books;
  } catch {
    return [];
  }
}

export default async function AdminBooksPage() {
  await requireAdmin();
  const books = await getBooksSafe();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">
          No books found or database not available.
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Slug</th>
              <th className="py-2 px-3">Created At</th>
              <th className="py-2 px-3">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b: any) => (
              <tr key={b.id} className="border-b">
                <td className="py-2 px-3">{b.id}</td>
                <td className="py-2 px-3">{b.title}</td>
                <td className="py-2 px-3">{b.slug}</td>
                <td className="py-2 px-3">
                  {new Date(b.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-3">
                  {new Date(b.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
