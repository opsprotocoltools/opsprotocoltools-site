// app/admin/logins/page.tsx
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLoginsPage() {
  await requireAdmin();

  const events = await prisma.loginAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Recent Login Attempts</h1>
      <table className="w-full border border-neutral-800 text-sm">
        <thead>
          <tr className="bg-neutral-900">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">IP</th>
            <th className="p-2 text-left">Success</th>
            <th className="p-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-t border-neutral-800">
              <td className="p-2">{e.email}</td>
              <td className="p-2">{e.ip ?? "—"}</td>
              <td className="p-2">{e.success ? "✅" : "❌"}</td>
              <td className="p-2">
                {new Date(e.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
