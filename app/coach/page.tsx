// app/coach/page.tsx

"use client";

import { FormEvent, useState } from "react";

export default function CoachPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: You can wire this to an API route or external form later.
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          1:1 Ops Protocol Coaching
        </h1>
        <p className="text-xs text-slate-300">
          Coaching is not therapy and not hype. It is implementation: building
          and running your own Ops Protocol system against real constraints.
        </p>
        <p className="text-xs text-slate-300">
          If you want help applying Bridge Timeline, Phase Map, and Sunday Dump
          to co-parenting, relationships, or leadership, share your context
          below. If it’s a fit, you’ll get a direct response.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-[10px]">
        {submitted ? (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-cyan-300">
              Submission received
            </h2>
            <p className="text-slate-300">
              Your context has been captured. This form is intentionally simple.
              Formal scheduling and details will follow if aligned.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400">Name</label>
              <input
                name="name"
                required
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400">
                What problem are you trying to run better?
              </label>
              <textarea
                name="context"
                required
                rows={5}
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="mt-2 rounded-full bg-cyan-500 px-4 py-2 text-[10px] font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Submit context
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
