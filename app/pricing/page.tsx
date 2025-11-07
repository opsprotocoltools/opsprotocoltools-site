// app/pricing/page.tsx

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Pricing
        </h1>
        <p className="max-w-2xl text-xs text-slate-300">
          Start with the core system, layer in tools as they launch, and use
          coaching only if needed. No confusion, no hidden tiers.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3 text-[10px]">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-50">
              Foundation
            </h2>
            <p className="text-slate-400">
              Access to Ops Protocol concepts, examples, and implementation
              guidance via books and resources.
            </p>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-lg font-semibold text-cyan-400">$TBD</div>
            <p className="text-[9px] text-slate-500">
              One-time purchases. No subscriptions at this tier.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-cyan-500/50 bg-slate-950 p-5 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-cyan-300">
              Tools (Coming Soon)
            </h2>
            <p className="text-slate-300">
              Access to interactive tools: Bridge Timeline console, Phase Map
              visualizer, Sunday Dump assistant.
            </p>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-lg font-semibold text-cyan-400">
              Early access
            </div>
            <p className="text-[9px] text-slate-500">
              Join waitlist via Coach page. Built for operators who want full
              stack visibility.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-50">
              1:1 Ops Coaching
            </h2>
            <p className="text-slate-400">
              Direct work sessions to implement Ops Protocol in your real
              context. No mindset speeches. System and execution only.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-lg font-semibold text-cyan-400">
              By application
            </div>
            <Link
              href="/coach"
              className="inline-flex rounded-full border border-cyan-400/60 px-3 py-1 text-[9px] text-cyan-300 hover:bg-cyan-500/10"
            >
              Submit context via Coach page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
