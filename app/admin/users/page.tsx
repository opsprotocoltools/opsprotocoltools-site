import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-8">
      <h1 className="text-2xl font-semibold text-white mb-2">
        Users
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        Read-only list of users with roles and creation timestamps.
      </p>

      <div className="overflow-x-auto border border-gray-800 rounded-xl bg-[#05070B]">
        <table className="min-w-full text-xs">
          <thead className="bg-black/70">
            <tr>
              <th className="px-3 py-2 text-left text-gray-500">ID</th>
              <th className="px-3 py-2 text-left text-gray-500">
                Email
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Role
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Created
              </th>
              <th className="px-3 py-2 text-left text-gray-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-800 hover:bg-gray-900/60"
                >
                  <td className="px-3 py-2 text-gray-300">
                    {user.id}
                  </td>
                  <td className="px-3 py-2 text-gray-100">
                    {user.email}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    {user.role}
                  </td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                    {user.createdAt.toISOString()}
                  </td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                    {user.updatedAt.toISOString()}
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
