// app/admin/users/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function UsersAdminPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_users", { userId: admin.id });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-50">Users</h1>
        <p className="text-[10px] text-slate-400">
          Read-only view of all users. Role and account changes will be managed
          via explicit actions later.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 text-[10px]">
        <table className="min-w-full">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-800/80 hover:bg-slate-900/70"
              >
                <td className="px-3 py-2 text-slate-400">{user.id}</td>
                <td className="px-3 py-2 text-slate-100">{user.email}</td>
                <td className="px-3 py-2 text-slate-300">
                  {user.name || "—"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[8px] ${
                      user.role === "ADMIN"
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-900/80 text-slate-300 border border-slate-700/60"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-400">
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
