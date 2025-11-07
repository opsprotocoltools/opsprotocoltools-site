"use client";

import { usePathname } from "next/navigation";

export default function AdminTopbar() {
  const rawPathname = usePathname() ?? "";
  const label =
    rawPathname.replace("/admin", "")?.replace("/", "") || "dashboard";

  return (
    <header className="flex items-center justify-between mb-4">
      <div className="text-sm text-slate-400 uppercase tracking-wide">
        {label || "dashboard"}
      </div>
    </header>
  );
}
