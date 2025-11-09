// app/admin/errors/page.tsx
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminErrorsPage() {
  await requireAdmin();

  const errors = await prisma.auditLog.findMany({
    where: { action: { contains: "ERROR" } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">System Errors (from Audit Log)</h1>
      <ul className="space-y-2 text-sm">
        {errors.map((err) => (
          <li
            key={err.id}
            className="border border-neutral-800 rounded-md p-3 bg-neutral-900/70"
          >
            <div className="font-mono text-xs text-neutral-400">
              {new Date(err.createdAt).toLocaleString()}
            </div>
            <div>{err.action}</div>
            {err.metadata && (
              <pre className="text-xs text-neutral-500 mt-1 overflow-auto max-h-24">
                {JSON.stringify(err.metadata, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
