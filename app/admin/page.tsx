// app/admin/page.tsx

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminHomePage() {
  const user = await requireAdmin();

  // safe counts: only use existing models
  const toolCount = await prisma.tool.count();
  const bookCount = await prisma.book.count();
  const knowledgeCount = await prisma.knowledgeChunk.count();
  const auditCount = await prisma.auditLog.count();
  const serviceAccountCount = await prisma.serviceAccount.count();
  const coachRequestCount = await prisma.coachRequest.count();
  const heartbeatCount = await prisma.heartbeat.count();

  const latestHeartbeat = await prisma.heartbeat.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Ops Protocol Tools Overview</h1>
      <p className="text-sm text-gray-400">Welcome, {user.email}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Tools</h2>
            <p className="text-2xl">{toolCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Books</h2>
            <p className="text-2xl">{bookCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Knowledge</h2>
            <p className="text-2xl">{knowledgeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Audits</h2>
            <p className="text-2xl">{auditCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Service Accounts</h2>
            <p className="text-2xl">{serviceAccountCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Coach Requests</h2>
            <p className="text-2xl">{coachRequestCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium">Heartbeats</h2>
            <p className="text-2xl">{heartbeatCount}</p>
            {latestHeartbeat ? (
              <p className="text-xs text-gray-400 mt-1">
                Last: {latestHeartbeat.createdAt.toLocaleString()}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">No records yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
