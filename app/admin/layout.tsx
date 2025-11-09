import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/logins", label: "Login Events" },
  { href: "/admin/errors", label: "Error Events" },
  { href: "/admin/heartbeats", label: "Heartbeats" },
  { href: "/admin/system", label: "System Status" }
];

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#05070B] border-r border-gray-800 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
            Ops Protocol
          </div>
          <div className="text-lg font-semibold text-gray-100">
            Admin Console
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-800 text-[10px] text-gray-500">
          Ops Protocol Tools • Internal
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-br from-[#020308] via-[#020308] to-[#050818]">
        {children}
      </main>
    </div>
  );
}
