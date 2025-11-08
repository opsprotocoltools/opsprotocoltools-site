import { requireAdmin } from "@/lib/auth";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function AdminBooksPage() {
  await requireAdmin();

  if (!process.env.DATABASE_URL) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Books</h1>
        <p className="text-red-600">DATABASE_URL is not configured.</p>
      </div>
    );
  }

  let books: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  }[] = [];

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, title, slug, description, "createdAt", "updatedAt"
       FROM "Book"
       ORDER BY "createdAt" DESC
       LIMIT 100;`
    );
    books = result.rows;
  } catch {
    books = [];
  } finally {
    client.release();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Books</h1>
      {books.length === 0 ? (
        <p className="text-gray-600">
          No books found or database query failed.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Title</th>
              <th className="border px-3 py-2 text-left">Slug</th>
              <th className="border px-3 py-2 text-left">Created</th>
              <th className="border px-3 py-2 text-left">Updated</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="border px-3 py-2">{b.id}</td>
                <td className="border px-3 py-2">{b.title}</td>
                <td className="border px-3 py-2">{b.slug}</td>
                <td className="border px-3 py-2">
                  {new Date(b.createdAt).toLocaleString()}
                </td>
                <td className="border px-3 py-2">
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
