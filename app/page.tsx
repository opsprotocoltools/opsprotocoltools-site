// app/page.tsx

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">
        Operational systems you can actually run.
      </h1>
      <p className="text-slate-300 max-w-2xl">
        Ops Protocol Tools is a focused suite of books, dashboards,
        and automations for operators who want clarity instead of noise.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-cyan-400">
            Books
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Structured playbooks and narratives backing the protocol.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-cyan-400">
            Bridge & Phase Map
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual models for timelines, states, and decision points.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-semibold text-cyan-400">
            Coach Layer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Admin tools and analytics to monitor integrity and outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
