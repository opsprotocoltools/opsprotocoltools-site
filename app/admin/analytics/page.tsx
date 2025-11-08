import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;      // disable ISR completely

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  let events:
    {
      id: number;
      event: string | null;
      createdAt: Date;
      userId: number | null;
      user: { email: string | null } | null;
    }[] = [];

  try {
    events = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    events = [];
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Analytics Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">
          No analytics events found or database query failed.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Event</th>
              <th className="border px-3 py-2 text-left">User Email</th>
              <th className="border px-3 py-2 text-left">User ID</th>
              <th className="border px-3 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="border px-3 py-2">{e.id}</td>
                <td className="border px-3 py-2">{e.event || "unknown"}</td>
                <td className="border px-3 py-2">
                  {e.user?.email || "—"}
                </td>
                <td className="border px-3 py-2">
                  {e.userId ?? "—"}
                </td>
                <td className="border px-3 py-2">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
