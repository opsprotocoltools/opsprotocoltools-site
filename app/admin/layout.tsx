// app/admin/layout.tsx

import { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout(
  { children }: { children: ReactNode }
) {
  await requireAdmin();

  return (
    <div className="min-h-[70vh] grid grid-cols-[220px,1fr] gap-6">
      <aside className="h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="text-sm font-semibold text-cyan-400">
          Ops Admin
        </div>
        <nav className="flex flex-col gap-2 text-xs text-slate-300">
          <a href="/admin">Overview</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/books">Books</a>
          <a href="/admin/analytics">Analytics</a>
        </nav>
      </aside>
      <section className="space-y-4">
        {children}
      </section>
    </div>
  );
}
