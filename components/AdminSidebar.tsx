"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-60 bg-slate-950 text-slate-100 p-4 gap-2">
      <div className="text-lg font-semibold mb-2">Ops Admin</div>
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              "rounded-xl px-3 py-2 text-sm transition " +
              (active
                ? "bg-brand-500 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white")
            }
          >
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}