import prisma from "@/lib/prisma";

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    orderBy: { id: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-8">
      <h1 className="text-2xl font-semibold text-white mb-2">
        Tools
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        Registry of Ops Protocol tools and internal modules.
      </p>

      <div className="overflow-x-auto border border-gray-800 rounded-xl bg-[#05070B]">
        <table className="min-w-full text-xs">
          <thead className="bg-black/70">
            <tr>
              <th className="px-3 py-2 text-left text-gray-500">ID</th>
              <th className="px-3 py-2 text-left text-gray-500">
                Title
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Slug
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Description
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-gray-500"
                >
                  No tools found.
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr
                  key={tool.id}
                  className="border-t border-gray-800 hover:bg-gray-900/60 align-top"
                >
                  <td className="px-3 py-2 text-gray-300">
                    {tool.id}
                  </td>
                  <td className="px-3 py-2 text-gray-100">
                    {tool.title}
                  </td>
                  <td className="px-3 py-2 text-gray-400">
                    {tool.slug}
                  </td>
                  <td className="px-3 py-2 text-gray-500 max-w-md break-words">
                    {tool.description || "-"}
                  </td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                    {tool.updatedAt.toISOString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
