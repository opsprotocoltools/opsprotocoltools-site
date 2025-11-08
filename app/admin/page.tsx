import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-gray-600">
        You are logged in as an admin. Use the navigation to view users, books,
        tools, and analytics.
      </p>
    </div>
  );
}
