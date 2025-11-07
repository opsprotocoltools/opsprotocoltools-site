// app/admin/analytics/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function AnalyticsAdminPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_analytics", { userId: admin.id });

  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-50">Analytics</h1>
        <p className="text-[10px] text-slate-400">
          Recent operational events. Used for debugging behavior and verifying
          flows. No personal content is required or shown.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 text-[10px]">
        <table className="min-w-full">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t border-slate-800/80 hover:bg-slate-900/70"
              >
                <td className="px-3 py-2 text-slate-400">
                  {event.createdAt.toISOString()}
                </td>
                <td className="px-3 py-2 text-cyan-300">
                  {event.type}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {event.user
                    ? `${event.user.email} (ID ${event.user.id})`
                    : "—"}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {event.metadata
                    ? JSON.stringify(event.metadata)
                    : "—"}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No analytics events logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
