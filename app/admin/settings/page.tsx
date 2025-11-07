import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminSettings() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Settings</h1>
        <p className="text-xs text-slate-400">
          Later: control admin users, API keys (from C:\\Ops5\\apis.txt), and feature flags.
        </p>
      </section>
    </div>
  );
}