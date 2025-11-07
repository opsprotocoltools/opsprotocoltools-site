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