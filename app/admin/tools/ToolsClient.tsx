"use client";

import { useState, useTransition } from "react";
import { addTool, deleteTool } from "@/app/actions/adminActions";
import { useRouter } from "next/navigation";

export default function ToolsClient({ tools }: { tools: any[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await addTool({ name, slug });
      setName("");
      setSlug("");
      router.refresh();
    });
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Tools</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Tool name (Bridge Tracker)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Slug (bridge-tracker)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          Add
        </button>
      </form>

      {tools && tools.length > 0 ? (
        <ul className="space-y-2">
          {tools.map((t) => (
            <li
              key={t.id}
              className="bg-white border p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">
                  /tools/{t.slug} · ID {t.id}
                </div>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteTool(t.id);
                    router.refresh();
                  })
                }
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No tools yet.</p>
      )}
    </div>
  );
}
