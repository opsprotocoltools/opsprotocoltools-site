import { requireAdmin } from "@/lib/auth";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function AdminUsersPage() {
  await requireAdmin();

  if (!process.env.DATABASE_URL) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>
        <p className="text-red-600">DATABASE_URL is not configured.</p>
      </div>
    );
  }

  let users: {
    id: number;
    email: string;
    role: string;
    name: string | null;
    createdAt: string;
  }[] = [];

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, role, name, "createdAt"
       FROM "User"
       ORDER BY id ASC
       LIMIT 100;`
    );
    users = result.rows;
  } catch {
    users = [];
  } finally {
    client.release();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {users.length === 0 ? (
        <p className="text-gray-600">
          No users found or database query failed.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Role</th>
              <th className="border px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="border px-3 py-2">{u.id}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2">{u.name ?? ""}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
