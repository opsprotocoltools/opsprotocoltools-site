import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const isBuildPhase =
  !!process.env.VERCEL &&
  process.env.NEXT_PHASE === "phase-production-build";

type AnalyticsRow = {
  id: number;
  event: string;
  createdAt: string;
  userId: number | null;
  userEmail: string | null;
};

export default async function AdminAnalyticsPage() {
  // Gate: only admins
  await requireAdmin();

  // Do NOT touch Prisma during Vercel build or if DB is missing.
  if (isBuildPhase || !process.env.DATABASE_URL) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Analytics Events</h1>
        <p className="text-gray-600">
          Analytics data loads at runtime. Skipping database access during
          build.
        </p>
      </div>
    );
  }

  // Lazy-load Prisma only at runtime
  const { default: prisma } = await import("@/lib/prisma");

  let events: AnalyticsRow[] = [];

  try {
    // Required by your spec:
    // - use prisma.analyticsEvent
    // - include user relation
    const rows = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    events = rows.map((e) => ({
      id: e.id,
      event: e.event || "unknown",
      createdAt: e.createdAt.toISOString(),
      userId: e.userId ?? null,
      userEmail: e.user?.email ?? null,
    }));
  } catch (error) {
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
                <td className="border px-3 py-2">{e.event}</td>
                <td className="border px-3 py-2">
                  {e.userEmail || "—"}
                </td>
                <td className="border px-3 py-2">
                  {e.userId !== null ? e.userId : "—"}
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
