// app/admin/users/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";
import { toggleUserRole, deleteUser } from "@/actions/adminActions";

export default async function UsersPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_users", { userId: admin.id });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <p className="text-xs text-slate-400">
        Manage roles and remove test accounts.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-800/80 hover:bg-slate-900/70"
              >
                <td className="px-3 py-2">{user.id}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">
                  {user.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <form action={toggleUserRole}>
                      <input
                        type="hidden"
                        name="userId"
                        value={user.id}
                      />
                      <button
                        type="submit"
                        className="rounded-xl border border-slate-700 px-2 py-1 text-[10px] text-cyan-400"
                      >
                        Toggle role
                      </button>
                    </form>
                    <form action={deleteUser}>
                      <input
                        type="hidden"
                        name="userId"
                        value={user.id}
                      />
                      <button
                        type="submit"
                        className="rounded-xl border border-red-500/60 px-2 py-1 text-[10px] text-red-400"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
