// app/admin/tools/page.tsx

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function ToolsAdminPage() {
  const admin = await requireAdmin();
  await logEvent("admin.view_tools", { userId: admin.id });

  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-50">Tools</h1>
        <p className="text-[10px] text-slate-400">
          Registry of Ops Protocol tools and endpoints. Used for internal
          mapping and future UI integration.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 text-[10px]">
        <table className="min-w-full">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">URL</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr
                key={tool.id}
                className="border-t border-slate-800/80 hover:bg-slate-900/70"
              >
                <td className="px-3 py-2 text-slate-400">{tool.id}</td>
                <td className="px-3 py-2 text-slate-100">{tool.name}</td>
                <td className="px-3 py-2 text-slate-300">{tool.slug}</td>
                <td className="px-3 py-2 text-cyan-300 break-all">
                  {tool.url}
                </td>
                <td className="px-3 py-2 text-slate-400">
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
                  No tools registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
