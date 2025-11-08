import { requireAdmin } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const adminUser = (session?.user as any) || {};

  await logEvent("admin_view_dashboard", {
    userId: adminUser.id ? Number(adminUser.id) : null,
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-slate-400">
        Welcome back, {adminUser.name || "Administrator"}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 p-4 bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-100">Users</h2>
          <p className="text-slate-400 text-sm">Manage user roles and access.</p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4 bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-100">Books</h2>
          <p className="text-slate-400 text-sm">View and edit Ops Protocol books.</p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4 bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-100">Analytics</h2>
          <p className="text-slate-400 text-sm">Monitor platform performance.</p>
        </div>
      </div>
    </div>
  );
}
