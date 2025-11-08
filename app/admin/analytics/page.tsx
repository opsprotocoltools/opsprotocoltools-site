import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Detect Vercel build so we do not hit Prisma during static generation
const isBuildPhase =
  !!process.env.VERCEL &&
  process.env.NEXT_PHASE === "phase-production-build";

type AnalyticsRow = {
  id: number;
  event: string | null;
  createdAt: Date;
  userId: number | null;
  user: {
    email: string | null;
  } | null;
};

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  // During build or if DB missing, render a safe placeholder.
  if (isBuildPhase || !process.env.DATABASE_URL) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Analytics Events</h1>
        <p className="text-gray-600">
          Analytics data is available at runtime. No database access during
          build.
        </p>
      </div>
    );
  }

  let events: AnalyticsRow[] = [];

  try {
    // Required by ops spec:
    // - use prisma.analyticsEvent
    // - include user relation
    const rows = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    events = rows as AnalyticsRow[];
  } catch (error) {
    // On runtime failure, show a non-fatal message
    console.error("Failed to load analytics events:", error);
    events = [];
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Analytics Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">
          No analytics events found or query failed.
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
                <td className="border px-3 py-2">
                  {e.event || "unknown"}
                </td>
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
