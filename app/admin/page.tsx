// app/admin/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

async function getDashboardStats() {
  const [userCount, bookCount, toolCount, eventCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.tool.count(),
    prisma.analyticsEvent.count(),
  ]);

  return { userCount, bookCount, toolCount, eventCount };
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  await logEvent("admin.view_dashboard", { userId: admin.id });

  const { userCount, bookCount, toolCount, eventCount } =
    await getDashboardStats();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Users" value={userCount} />
        <Stat label="Books" value={bookCount} />
        <Stat label="Tools" value={toolCount} />
        <Stat label="Events" value={eventCount} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
