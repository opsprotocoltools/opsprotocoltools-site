// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
        Ops Protocol Tools
      </div>
      <h1 className="text-2xl font-semibold text-slate-50">
        This route is out of phase.
      </h1>
      <p className="mt-2 max-w-md text-xs text-slate-400">
        The page you’re looking for doesn’t exist in this timeline. Check the URL
        or return to the main dashboard for stable ground.
      </p>
      <div className="mt-5 flex gap-3 text-xs">
        <Link
          href="/"
          className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Back to home
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-slate-600 px-4 py-2 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
        >
          Admin login
        </Link>
      </div>
    </div>
  );
}
