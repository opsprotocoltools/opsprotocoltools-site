// components/SiteHeader.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/pricing", label: "Pricing" },
  { href: "/bridge", label: "Bridge" },
  { href: "/phase-map", label: "Phase Map" },
  { href: "/coach", label: "Coach" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/90 text-[10px] font-black text-slate-950">
            OP
          </span>
          <span>Ops Protocol Tools</span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs text-slate-300 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  active
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="rounded-full border border-cyan-400/50 px-3 py-1 text-[10px] font-medium text-cyan-300 hover:bg-cyan-500/10"
          >
            Admin login
          </Link>
        </nav>

        <button
          className="block rounded-full border border-slate-700 p-1 text-slate-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-4 bg-slate-300 mb-1" />
          <span className="block h-0.5 w-4 bg-slate-300 mb-1" />
          <span className="block h-0.5 w-4 bg-slate-300" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800/80 bg-slate-950 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-xs text-slate-300">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    active
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-cyan-300"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="mt-2 inline-flex w-fit rounded-full border border-cyan-400/50 px-3 py-1 text-[10px] font-medium text-cyan-300 hover:bg-cyan-500/10"
              onClick={() => setOpen(false)}
            >
              Admin login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
