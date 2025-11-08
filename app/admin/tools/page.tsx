import React from "react";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getToolsSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
    });
    return tools;
  } catch {
    return [];
  }
}

export default async function AdminToolsPage() {
  await requireAdmin();
  const tools = await getToolsSafe();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tools</h1>

      {tools.length === 0 ? (
        <p className="text-gray-500">
          No tools found or database not available.
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Slug</th>
              <th className="py-2 px-3">URL</th>
              <th className="py-2 px-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="py-2 px-3">{t.id}</td>
                <td className="py-2 px-3">{t.name}</td>
                <td className="py-2 px-3">{t.slug}</td>
                <td className="py-2 px-3">{t.url}</td>
                <td className="py-2 px-3">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
