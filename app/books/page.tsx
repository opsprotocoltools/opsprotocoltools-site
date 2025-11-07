// app/books/page.tsx

import Link from "next/link";

const books = [
  {
    title: "Ops Protocol: Bridge Timeline",
    description:
      "A practical field manual for logging real events and decisions without emotional distortion.",
    status: "Available soon",
    href: "#",
  },
  {
    title: "Ops Protocol: Phase Map",
    description:
      "Understand cycles of tension, repair, trust, and distance across any critical relationship.",
    status: "In development",
    href: "#",
  },
  {
    title: "Ops Protocol: Sunday Dump",
    description:
      "A weekly operating rhythm to keep your life aligned with what you claim matters.",
    status: "Available soon",
    href: "#",
  },
];

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Ops Protocol Books & Guides
        </h1>
        <p className="max-w-2xl text-xs text-slate-300">
          Structured resources built from the same system that runs Ops Protocol
          Tools. No fluff, no filler—just mechanisms you can implement.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3 text-[10px]">
        {books.map((book) => (
          <div
            key={book.title}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition-transform hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-slate-50">
                {book.title}
              </h2>
              <p className="text-slate-400">{book.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[9px] text-slate-500">
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[8px] uppercase tracking-wide text-cyan-300">
                {book.status}
              </span>
              <Link
                href={book.href}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Details soon
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
