import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function ToolsAdminPage() {
  const session = await requireAdmin();
  const adminUser = (session?.user as any) || {};

  await logEvent("admin_view_tools", {
    userId: adminUser.id ? Number(adminUser.id) : null,
  });

  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tools Admin</h1>
      <p className="text-sm text-slate-400 mb-4">
        Manage Ops Protocol tools shown on the public site.
      </p>

      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                ID
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Name
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Slug
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                URL
              </th>
              <th className="px-3 py-2 text-left border-b border-slate-800">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b border-slate-900">
                <td className="px-3 py-2 text-slate-300">{tool.id}</td>
                <td className="px-3 py-2 text-slate-100">{tool.name}</td>
                <td className="px-3 py-2 text-slate-400">{tool.slug}</td>
                <td className="px-3 py-2 text-cyan-300 break-all">
                  {tool.url || "—"}
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {tool.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No tools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
