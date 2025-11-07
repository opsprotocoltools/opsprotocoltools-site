// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Why I built Ops Protocol Tools
        </h1>
        <p className="text-xs text-slate-300">
          I created Ops Protocol Tools out of necessity. I needed a way to turn
          uncertainty, conflict, and responsibility into something I could
          measure and act on. Not a journal. Not a vague “mindset” shift. An
          operational system for real life.
        </p>
        <p className="text-xs text-slate-300">
          It started as a framework to keep communication stable across two
          households and high-stakes decisions. The goal was simple: separate
          facts from narratives, keep what matters centered, and stop reacting
          blindly. As I refined it, the same structure proved effective for work,
          relationships, and personal integrity. Ops Protocol became my default
          way of running everything.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          The three pillars
        </h2>
        <p className="text-xs text-slate-300">
          <span className="font-semibold text-cyan-300">Bridge Timeline</span>{" "}
          records what actually happens. It is a factual sequence of events,
          decisions, and outcomes. It removes the fog that shows up when you try
          to remember arguments, agreements, or turning points from memory.
        </p>
        <p className="text-xs text-slate-300">
          <span className="font-semibold text-violet-300">Phase Map</span>{" "}
          tracks states and phases over time. Instead of pretending everything is
          binary or stable, it acknowledges cycles: tension, repair, trust,
          distance, alignment. Once those cycles are visible, they stop feeling
          random.
        </p>
        <p className="text-xs text-slate-300">
          <span className="font-semibold text-emerald-300">Sunday Dump</span>{" "}
          is the reset ritual. Once a week, everything is reviewed, sorted, and
          cleared. It exposes drift between what you say matters and how you are
          actually behaving. No drama, just alignment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          What Ops Protocol Tools is for
        </h2>
        <p className="text-xs text-slate-300">
          Ops Protocol Tools is infrastructure for humans who take responsibility
          seriously. It is for people who want to see patterns, not just feel
          them. For people who would rather confront reality cleanly than cycle
          through the same arguments, doubts, or impulsive decisions.
        </p>
        <p className="text-xs text-slate-300">
          This is not therapy. It is not productivity porn. It is not a
          motivational brand. It is a clear set of mechanisms for tracking events,
          phases, and weekly integrity so you can act from data instead of
          distortion.
        </p>
        <p className="text-xs text-slate-300">
          I built this system for myself first. If it helps you see your life
          with the same precision, then it is doing its job.
        </p>
      </section>
    </div>
  );
}
