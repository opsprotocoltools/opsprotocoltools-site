// app/admin/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [usersCount, booksCount, toolsCount, eventsCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.tool.count(),
      prisma.analyticsEvent.count(),
    ]);

  await logEvent("admin.view_dashboard", { userId: admin.id });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">
          Admin Dashboard
        </h1>
        <p className="text-[10px] text-slate-400">
          Overview of Ops Protocol Tools activity. Read-only. No destructive
          actions wired at this stage.
        </p>
      </header>

      <section className="grid gap-3 text-[10px] md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-[9px] text-slate-500">Users</div>
          <div className="mt-1 text-lg font-semibold text-cyan-400">
            {usersCount}
          </div>
          <div className="mt-1 text-[8px] text-slate-500">
            Total accounts in system.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-[9px] text-slate-500">Books</div>
          <div className="mt-1 text-lg font-semibold text-violet-300">
            {booksCount}
          </div>
          <div className="mt-1 text-[8px] text-slate-500">
            Published or staged Ops resources.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-[9px] text-slate-500">Tools</div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {toolsCount}
          </div>
          <div className="mt-1 text-[8px] text-slate-500">
            Registered internal tools.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-[9px] text-slate-500">Events</div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {eventsCount}
          </div>
          <div className="mt-1 text-[8px] text-slate-500">
            Analytics events logged.
          </div>
        </div>
      </section>

      <section className="space-y-2 text-[10px]">
        <h2 className="text-[11px] font-semibold text-slate-100">
          Operational notes
        </h2>
        <ul className="space-y-1 text-slate-400">
          <li>• All admin routes are protected by server-side role checks.</li>
          <li>• Current UI is read-only to prevent accidental production edits.</li>
          <li>• Analytics events summarize usage; no sensitive content stored.</li>
        </ul>
      </section>
    </div>
  );
}
