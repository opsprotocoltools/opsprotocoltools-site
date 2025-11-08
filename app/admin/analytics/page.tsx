import React from "react";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getAnalyticsSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const events = await prisma.analyticsEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return events;
  } catch {
    return [];
  }
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const analytics = await getAnalyticsSafe();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Analytics Events</h1>

      {analytics.length === 0 ? (
        <p className="text-gray-500">
          No analytics events found or database not available.
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Event</th>
              <th className="py-2 px-3">User Email</th>
              <th className="py-2 px-3">User ID</th>
              <th className="py-2 px-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="py-2 px-3">{a.id}</td>
                <td className="py-2 px-3">{a.event || "unknown"}</td>
                <td className="py-2 px-3">
                  {a.user?.email ? a.user.email : "—"}
                </td>
                <td className="py-2 px-3">
                  {a.userId !== null && a.userId !== undefined
                    ? a.userId
                    : "—"}
                </td>
                <td className="py-2 px-3">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
