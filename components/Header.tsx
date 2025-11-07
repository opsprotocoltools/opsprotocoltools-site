"use client";
import ThemeToggle from "./ThemeToggle";

export default function Header(){
  return (
    <header className="border-b border-black/5 dark:border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">Ops Protocol Tools</a>
        <nav className="hidden md:flex gap-6 text-sm">
          <a className="hover:underline" href="/books">Books</a>
          <a className="hover:underline" href="/pricing">Pricing</a>
          <a className="hover:underline" href="/tools/bridge">Bridge</a>
          <a className="hover:underline" href="/tools/phase-map">Phase Map</a>
          <a className="hover:underline" href="/tools/decision-coach">Coach</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
