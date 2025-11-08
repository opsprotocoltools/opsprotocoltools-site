import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function BooksAdminPage() {
  const session = await requireAdmin();
  const adminUser = (session?.user as any) || {};

  await logEvent("admin_view_books", {
    userId: adminUser.id ? Number(adminUser.id) : null,
  });

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books Admin</h1>
      <p className="text-sm text-slate-400 mb-4">
        Manage Ops Protocol related books and references.
      </p>

      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                ID
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Title
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Slug
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-slate-900">
                <td className="px-3 py-2 text-slate-300">{book.id}</td>
                <td className="px-3 py-2 text-slate-100">{book.title}</td>
                <td className="px-3 py-2 text-slate-400">{book.slug}</td>
                <td className="px-3 py-2 text-slate-500">
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
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
