// components/SiteFooter.tsx

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[10px] text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-slate-300">
            Ops Protocol Tools
          </div>
          <div>
            A structured system for Bridge Timeline, Phase Map, and Sunday Dump.
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href="/about"
            className="hover:text-cyan-300"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="hover:text-cyan-300"
          >
            Pricing
          </Link>
          <Link
            href="/coach"
            className="hover:text-cyan-300"
          >
            Coaching
          </Link>
        </div>
        <div className="text-[9px] text-slate-600">
          © {new Date().getFullYear()} Ops Protocol Tools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
