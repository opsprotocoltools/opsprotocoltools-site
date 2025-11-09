// app/admin/system/page.tsx
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminSystemPage() {
  await requireAdmin();

  const [heartbeatCount, coachRequestCount, auditCount] = await Promise.all([
    prisma.heartbeat.count(),
    prisma.coachRequest.count(),
    prisma.auditLog.count(),
  ]);

  const latestHeartbeat = await prisma.heartbeat.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">System Overview</h1>
      <div className="space-y-1 text-sm text-neutral-300">
        <div>Heartbeat records: {heartbeatCount}</div>
        <div>Coach requests: {coachRequestCount}</div>
        <div>Audit log entries: {auditCount}</div>
        <div>
          Latest heartbeat:{" "}
          {latestHeartbeat
            ? new Date(latestHeartbeat.createdAt).toLocaleString()
            : "No records"}
        </div>
      </div>
    </div>
  );
}
