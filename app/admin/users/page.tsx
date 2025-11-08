import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function UsersAdminPage() {
  const session = await requireAdmin();
  const adminUser = (session?.user as any) || {};

  await logEvent("admin_view_users", {
    userId: adminUser.id ? Number(adminUser.id) : null,
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Admin</h1>
      <p className="text-sm text-slate-400 mb-4">
        Manage user accounts and roles.
      </p>

      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                ID
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Name
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Email
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Role
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-900">
                <td className="px-3 py-2 text-slate-300">{user.id}</td>
                <td className="px-3 py-2 text-slate-100">{user.name}</td>
                <td className="px-3 py-2 text-slate-400">{user.email}</td>
                <td className="px-3 py-2 text-cyan-300">{user.role}</td>
                <td className="px-3 py-2 text-slate-500">
                  {user.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
