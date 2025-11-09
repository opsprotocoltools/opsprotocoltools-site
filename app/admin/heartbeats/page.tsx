// app/admin/heartbeats/page.tsx

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminHeartbeatsPage() {
  await requireAdmin();

  const beats = await prisma.heartbeat.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Heartbeats / System Health
      </h1>

      {beats.length === 0 ? (
        <div className="text-sm text-neutral-400">
          No heartbeat records yet. Once the cron endpoint runs, entries will appear here.
        </div>
      ) : (
        <table className="w-full border border-neutral-800 text-sm">
          <thead>
            <tr className="bg-neutral-900">
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">OK</th>
              <th className="p-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {beats.map((b) => (
              <tr key={b.id} className="border-t border-neutral-800">
                <td className="p-2 whitespace-nowrap text-xs text-neutral-400">
                  {new Date(b.createdAt).toLocaleString()}
                </td>
                <td className="p-2 text-xs">{b.type}</td>
                <td className="p-2 text-xs">{b.ok ? "✅" : "❌"}</td>
                <td className="p-2 text-xs text-neutral-300">
                  {b.message || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
