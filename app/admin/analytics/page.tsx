import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AnalyticsPage() {
  await requireAdmin();

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
    <div className="min-h-screen px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Recent tracked events. Minimal operational telemetry only.
      </p>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                Time
              </th>
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                Event
              </th>
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-zinc-300">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-zinc-200">
                  {e.event}
                </td>
                <td className="px-3 py-2 text-zinc-400">
                  {e.user?.email ?? "—"}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-4 text-center text-zinc-500"
                >
                  No analytics events recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
