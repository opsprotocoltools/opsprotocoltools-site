import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 space-y-4">
      <h1 className="text-4xl font-bold">Ops Protocol Tools</h1>
      <p className="text-lg">Bridge Theory, Co-Parenting Systems, and Tools.</p>
      <div className="flex gap-4">
        <Link href="/books" className="underline">Books</Link>
        <Link href="/tools" className="underline">Tools</Link>
      </div>
    </main>
  );
}
