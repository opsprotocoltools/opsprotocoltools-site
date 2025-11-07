import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminMarketing() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Marketing Kits</h1>
        <p className="text-xs text-slate-400">
          Later: edit social calendar, sales pages, and bundles from here.
        </p>
      </section>
    </div>
  );
}