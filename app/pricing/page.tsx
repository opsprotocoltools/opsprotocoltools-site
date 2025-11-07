// app/pricing/page.tsx

export default function PricingPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold">Reader</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access to books and core frameworks.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/60 bg-slate-900/60 p-4">
          <h2 className="text-lg font-semibold">Operator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Adds tools, templates, and updates.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold">Agency</h2>
          <p className="text-xs text-slate-400 mt-1">
            For teams implementing Ops Protocol with clients.
          </p>
        </div>
      </div>
    </section>
  );
}
