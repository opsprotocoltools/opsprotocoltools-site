"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("opt_theme") === "dark";
    setDark(saved);
    if (saved) document.documentElement.classList.add("dark");
    setReady(true);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("opt_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }
  if (!ready) return null;
  return (
    <button onClick={toggle} className="rounded-xl px-3 py-1 text-sm border border-black/10 dark:border-white/10">
      {dark ? "Light" : "Dark"}
    </button>
  );
}
