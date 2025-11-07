// app/bridge/page.tsx

export default function BridgePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Bridge Timeline
        </h1>
        <p className="text-xs text-slate-300">
          Bridge Timeline is the factual backbone of Ops Protocol. It records
          what actually happened: events, decisions, commitments, breaks,
          repairs. No spin. No summaries written weeks later from memory.
        </p>
        <p className="text-xs text-slate-300">
          The goal is not to obsess over details. The goal is to anchor critical
          patterns so when conflict or confusion hits, you have a stable record
          instead of competing stories.
        </p>
      </section>

      <section className="space-y-3 text-[10px]">
        <h2 className="text-sm font-semibold text-slate-100">
          How to use it
        </h2>
        <ul className="space-y-2 text-slate-300">
          <li>• Log only meaningful events and decisions.</li>
          <li>• Tag by category: agreement, breach, repair, decision, escalation.</li>
          <li>• Review during Sunday Dump to map cause/effect over time.</li>
        </ul>
        <p className="text-slate-400">
          Ops Protocol Tools will eventually include a dedicated Bridge console
          for structured input and retrieval.
        </p>
      </section>
    </div>
  );
}
