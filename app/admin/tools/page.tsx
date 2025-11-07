import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminToolsPage() {
  await requireAdmin();
  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
          <p className="text-xs text-slate-500">
            Manage live Ops Protocol interactive tools.
          </p>
        </div>
        <Link
          href="#"
          className="rounded-lg bg-slate-800 text-white px-3 py-1 text-xs hover:bg-slate-700"
        >
          + Add New Tool
        </Link>
      </header>

      {tools.length === 0 ? (
        <p className="text-sm text-slate-500">No tools found.</p>
      ) : (
        <ul className="space-y-2">
          {tools.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm flex justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.slug}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/tools/${t.id}`}
                  className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50"
                >
                  Edit
                </Link>
                <button
                  className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
