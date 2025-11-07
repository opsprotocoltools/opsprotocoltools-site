// app/admin/books/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function BooksAdminPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_books", { userId: admin.id });

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-50">Books</h1>
        <p className="text-[10px] text-slate-400">
          Internal registry of Ops Protocol resources. Future: manage slugs and
          links from here.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 text-[10px]">
        <table className="min-w-full">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-t border-slate-800/80 hover:bg-slate-900/70"
              >
                <td className="px-3 py-2 text-slate-400">{book.id}</td>
                <td className="px-3 py-2 text-slate-100">{book.title}</td>
                <td className="px-3 py-2 text-slate-300">{book.slug}</td>
                <td className="px-3 py-2 text-slate-400">
                  {book.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No books defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
