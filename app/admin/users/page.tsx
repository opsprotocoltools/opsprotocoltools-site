import React from "react";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getUsersSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getUsersSafe();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">
          No users found or database not available.
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-3">{u.id}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3">{u.role}</td>
                <td className="py-2 px-3">
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
