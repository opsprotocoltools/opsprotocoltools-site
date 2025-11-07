// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/70 px-3 py-1 text-[10px] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Operational clarity for real life, not theory.
          </div>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Run your life like it matters.
          </h1>
          <p className="max-w-xl text-xs text-slate-300">
            Ops Protocol Tools is a structured system built around three pillars:
            Bridge Timeline, Phase Map, and Sunday Dump. It turns chaos into
            clear signals so you can navigate co-parenting, relationships, and
            personal decisions with integrity.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link
              href="/pricing"
              className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              View pricing
            </Link>
            <Link
              href="/books"
              className="rounded-full border border-slate-600 px-4 py-2 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Explore books
            </Link>
            <Link
              href="/about"
              className="rounded-full px-3 py-2 text-slate-400 hover:text-cyan-300"
            >
              How this system was built
            </Link>
          </div>
        </div>

        {/* Pillars summary */}
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-[10px]">
          <div className="font-semibold text-slate-200">
            Three pillars of Ops Protocol
          </div>
          <div className="rounded-xl bg-slate-900/70 p-3">
            <div className="text-[10px] font-semibold text-cyan-300">
              Bridge Timeline
            </div>
            <p className="mt-1 text-[10px] text-slate-300">
              Log real events, not stories. Build a factual timeline to anchor
              decisions and patterns.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/70 p-3">
            <div className="text-[10px] font-semibold text-violet-300">
              Phase Map
            </div>
            <p className="mt-1 text-[10px] text-slate-300">
              Track relational and emotional phases over time so you see cycles
              before they collide.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/70 p-3">
            <div className="text-[10px] font-semibold text-emerald-300">
              Sunday Dump
            </div>
            <p className="mt-1 text-[10px] text-slate-300">
              Weekly reset: clear the backlog, reconcile drift, and align intent
              with behavior for the next week.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-100">
          How Ops Protocol Tools fits into your week
        </h2>
        <div className="grid gap-4 text-[10px] md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-1 text-xs font-semibold text-cyan-300">
              1. Capture
            </div>
            <p className="text-slate-300">
              Bridge Timeline records anchor events, agreements, breaks,
              escalations, and repairs.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-1 text-xs font-semibold text-violet-300">
              2. Map
            </div>
            <p className="text-slate-300">
              Phase Map shows where relationships and states actually are, not
              where you want them to be.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-1 text-xs font-semibold text-emerald-300">
              3. Reset
            </div>
            <p className="text-slate-300">
              Sunday Dump closes the loop each week so nothing critical slips
              through.
            </p>
          </div>
        </div>
      </section>

      {/* Coming tools */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Tools built on this system
        </h2>
        <p className="text-[10px] text-slate-400">
          Ops Protocol Tools is evolving into a full stack of interactive
          products. Early access features are in development.
        </p>
        <div className="grid gap-4 text-[10px] md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-semibold text-cyan-300">
              Bridge Timeline Console
            </div>
            <p className="mt-1 text-slate-300">
              Structured event logging with filters for conflict, commitments,
              and outcomes.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-semibold text-violet-300">
              Phase Map Visualizer
            </div>
            <p className="mt-1 text-slate-300">
              Visual map of relationship phases and stability over time.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-semibold text-emerald-300">
              Sunday Dump Assistant
            </div>
            <p className="mt-1 text-slate-300">
              Guided weekly review that outputs decisions, next steps, and
              integrity checks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
