// app/layout.tsx

import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Ops Protocol Tools",
  description: "Admin-grade systems for operations, writing, and analytics.",
};

export default function RootLayout(
  { children }: { children: ReactNode }
) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-slate-800">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-cyan-500/90" />
                <span className="font-semibold tracking-tight">
                  Ops Protocol Tools
                </span>
              </div>
              <nav className="flex gap-4 text-sm text-slate-300">
                <a href="/">Home</a>
                <a href="/books">Books</a>
                <a href="/bridge">Bridge</a>
                <a href="/phase-map">Phase Map</a>
                <a href="/coach">Coach</a>
                <a href="/pricing">Pricing</a>
                <a href="/login" className="font-medium text-cyan-400">
                  Admin
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
