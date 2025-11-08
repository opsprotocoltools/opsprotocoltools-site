import { requireAdmin } from "@/lib/auth";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function AdminToolsPage() {
  await requireAdmin();

  if (!process.env.DATABASE_URL) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Tools</h1>
        <p className="text-red-600">DATABASE_URL is not configured.</p>
      </div>
    );
  }

  let tools: {
    id: number;
    name: string;
    slug: string;
    url: string;
    description: string | null;
    createdAt: string;
  }[] = [];

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, slug, url, description, "createdAt"
       FROM "Tool"
       ORDER BY "createdAt" DESC
       LIMIT 100;`
    );
    tools = result.rows;
  } catch {
    tools = [];
  } finally {
    client.release();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tools</h1>
      {tools.length === 0 ? (
        <p className="text-gray-600">
          No tools found or database query failed.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Slug</th>
              <th className="border px-3 py-2 text-left">URL</th>
              <th className="border px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="border px-3 py-2">{t.id}</td>
                <td className="border px-3 py-2">{t.name}</td>
                <td className="border px-3 py-2">{t.slug}</td>
                <td className="border px-3 py-2">
                  <a
                    href={t.url}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    {t.url}
                  </a>
                </td>
                <td className="border px-3 py-2">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
