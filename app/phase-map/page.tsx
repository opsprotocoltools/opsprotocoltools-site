// app/phase-map/page.tsx

export default function PhaseMapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Phase Map
        </h1>
        <p className="text-xs text-slate-300">
          Phase Map tracks relational and emotional states over time. Instead of
          pretending things are “fine” or “ruined”, you track phases: stable,
          strained, volatile, rebuilding, aligned.
        </p>
        <p className="text-xs text-slate-300">
          Once you see phases as cycles instead of verdicts, you stop reacting
          like everything is permanent. You respond based on where you are in
          the arc.
        </p>
      </section>

      <section className="space-y-3 text-[10px]">
        <h2 className="text-sm font-semibold text-slate-100">
          How to use it
        </h2>
        <ul className="space-y-2 text-slate-300">
          <li>• Define clear labels for phases that matter in your context.</li>
          <li>• Update phase when reality changes, not when you’re flooded.</li>
          <li>• Compare Phase Map against Bridge Timeline to detect patterns.</li>
        </ul>
        <p className="text-slate-400">
          Future tools will visualize this over time so you can see drift and
          recovery at a glance.
        </p>
      </section>
    </div>
  );
}
