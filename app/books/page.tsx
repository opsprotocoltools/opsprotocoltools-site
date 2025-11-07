// app/books/page.tsx

export default function BooksPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Books</h1>
      <p className="text-slate-300 text-sm max-w-2xl">
        Library of Ops Protocol titles. In this phase, content is static.
        Later it will be driven from the Book model in Prisma.
      </p>
    </section>
  );
}
