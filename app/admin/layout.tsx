// app/admin/layout.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-[80vh]">
      <aside className="hidden w-52 flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-5 text-[10px] text-slate-300 md:flex">
        <div className="mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Ops Admin
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-slate-900 hover:text-cyan-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-[8px] text-slate-500">
            Environment: <span className="text-emerald-400">Production</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-700 px-3 py-1 text-[9px] text-slate-300 hover:border-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
}
