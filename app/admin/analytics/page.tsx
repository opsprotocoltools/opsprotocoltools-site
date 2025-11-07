// app/admin/analytics/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_analytics", { userId: admin.id });

  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <p className="text-xs text-slate-400">
        Latest events for debugging and integrity checks.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full text-[10px]">
          <thead className="bg-slate-900/80 text-slate-400">
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
                <td className="px-3 py-2">
                  {event.createdAt.toISOString()}
                </td>
                <td className="px-3 py-2">{event.type}</td>
                <td className="px-3 py-2">
                  {event.user
                    ? `${event.user.email} (#${event.user.id})`
                    : "N/A"}
                </td>
                <td className="px-3 py-2">
                  <pre className="whitespace-pre-wrap break-all text-[9px] text-slate-400">
                    {JSON.stringify(event.metadata || {}, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No events logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
