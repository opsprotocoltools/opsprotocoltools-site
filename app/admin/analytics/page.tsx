// app/admin/analytics/page.tsx

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.analyticsEvent.count();

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Analytics Events</h1>
        <div className="text-xs text-neutral-400">
          Showing last {events.length} of {total} total
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-sm text-neutral-400">
          No analytics events logged yet. Once the site starts sending events to{" "}
          <code className="px-1 py-0.5 bg-neutral-900/80 rounded">
            /api/analytics
          </code>{" "}
          they will appear here.
        </div>
      ) : (
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="bg-neutral-900">
              <th className="p-2 text-left">When</th>
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-t border-neutral-800 align-top"
              >
                <td className="p-2 whitespace-nowrap text-xs text-neutral-400">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="p-2 font-mono text-xs">{e.event}</td>
                <td className="p-2 text-xs text-neutral-400">{e.type}</td>
                <td className="p-2 text-xs">
                  {e.user
                    ? `${e.user.email} (#${e.user.id})`
                    : "anon"}
                </td>
                <td className="p-2 text-[10px] text-neutral-400 max-w-xs">
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(e.metadata || {}, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
