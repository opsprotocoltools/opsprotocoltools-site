"use client";

import React, { useTransition } from "react";
import { toggleUserAdmin, deleteUser } from "@/app/actions/adminActions";

type UserRow = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string | Date;
};

interface UsersClientProps {
  users: UserRow[];
}

export default function UsersClient({ users }: UsersClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleAdmin = (id: number) => {
    startTransition(async () => {
      await toggleUserAdmin(id);
    });
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Delete this user? This cannot be undone.");
    if (!ok) return;

    startTransition(async () => {
      await deleteUser(id);
    });
  };

  if (!users || users.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Users</h1>
        <p className="text-sm text-gray-600">No users found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        {isPending && (
          <span className="text-xs text-gray-500">Updating…</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-2 px-2">ID</th>
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-left py-2 px-2">Email</th>
              <th className="text-left py-2 px-2">Role</th>
              <th className="text-left py-2 px-2">Created</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const created =
                u.createdAt instanceof Date
                  ? u.createdAt
                  : new Date(u.createdAt);

              return (
                <tr key={u.id} className="border-b">
                  <td className="py-2 px-2">{u.id}</td>
                  <td className="py-2 px-2">{u.name || "—"}</td>
                  <td className="py-2 px-2">{u.email}</td>
                  <td className="py-2 px-2">{u.role}</td>
                  <td className="py-2 px-2">
                    {isNaN(created.getTime())
                      ? "Unknown"
                      : created.toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2 space-x-2">
                    <button
                      onClick={() => handleToggleAdmin(u.id)}
                      disabled={isPending}
                      className="px-2 py-1 border rounded text-xs"
                    >
                      {u.role === "ADMIN" ? "Remove admin" : "Make admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={isPending}
                      className="px-2 py-1 border rounded text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
