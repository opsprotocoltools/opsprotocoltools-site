# setup_dashboard.ps1
# Adds a dark, professional admin dashboard shell and navigation.
# Assumes you run from C:\Ops5\web\nextjs-site

$ErrorActionPreference = "Stop"

function Write-TextFile {
    param(
        [string]$Path,
        [string]$Content
    )
    $full = Join-Path (Get-Location) $Path
    $dir = Split-Path $full
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.Encoding]::UTF8)
}

# 1) Admin Sidebar
Write-TextFile "components\AdminSidebar.tsx" @"
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
"@

# 2) Admin Topbar (inside admin pages)
Write-TextFile "components\AdminTopbar.tsx" @"
"use client";

import { usePathname } from "next/navigation";

export default function AdminTopbar() {
  const pathname = usePathname();
  const label = pathname.replace("/admin", "") || "/dashboard";
  return (
    <header className="flex items-center justify-between mb-4">
      <div className="text-sm text-slate-400 uppercase tracking-wide">
        Admin {label}
      </div>
      <div className="text-xs text-slate-500">
        Local-only demo • Auth wired via env credentials
      </div>
    </header>
  );
}
"@

# 3) Admin Layout
Write-TextFile "app\admin\layout.tsx" @"
import type { ReactNode } from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-4">
        {children}
      </main>
    </div>
  );
}
"@

# 4) Admin Dashboard page
Write-TextFile "app\admin\page.tsx" @"
import AdminTopbar from "../../components/AdminTopbar";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminTopbar />
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Books Published</div>
          <div className="text-2xl font-semibold mt-1">30</div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Bundles</div>
          <div className="text-2xl font-semibold mt-1">5</div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Store Integrations</div>
          <div className="text-sm mt-1">Lemon Squeezy / Payhip / Gumroad</div>
        </div>
      </section>
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h2 className="text-sm font-semibold mb-2 text-slate-200">
          Operational Snapshot
        </h2>
        <p className="text-xs text-slate-400">
          This area will read from your analytics + CRM exports to show revenue,
          completion rates, Bridge Tracker usage, and funnel performance.
        </p>
      </section>
    </div>
  );
}
"@

# 5) Placeholder sub-pages
Write-TextFile "app\admin\books\page.tsx" @"
import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminBooks() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Books Manager</h1>
        <p className="text-xs text-slate-400">
          Later: auto-read JSON/markdown from /content to control titles,
          blurbs, pricing, and store IDs.
        </p>
      </section>
    </div>
  );
}
"@

Write-TextFile "app\admin\analytics\page.tsx" @"
import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminAnalytics() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Analytics</h1>
        <p className="text-xs text-slate-400">
          Later: hook into unified analytics JSON from your Phase 6 pipeline.
        </p>
      </section>
    </div>
  );
}
"@

Write-TextFile "app\admin\marketing\page.tsx" @"
import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminMarketing() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Marketing Kits</h1>
        <p className="text-xs text-slate-400">
          Later: edit social calendar, sales pages, and bundles from here.
        </p>
      </section>
    </div>
  );
}
"@

Write-TextFile "app\admin\settings\page.tsx" @"
import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminSettings() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <h1 className="text-lg font-semibold mb-2">Settings</h1>
        <p className="text-xs text-slate-400">
          Later: control admin users, API keys (from C:\\Ops5\\apis.txt), and feature flags.
        </p>
      </section>
    </div>
  );
}
"@

Write-Host "Dashboard layout files created. Run 'npm run dev' and open /admin."
