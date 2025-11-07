"use client";

import { useState, useTransition } from "react";
import { addBook, deleteBook } from "@/app/actions/adminActions";
import { useRouter } from "next/navigation";

export default function BooksClient({ books }: { books: any[] }) {
  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await addBook({ title, volume: Number(volume) || 1 });
      setTitle("");
      setVolume("");
      router.refresh();
    });
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Books</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Book title (e.g. Ops Protocol Vol. 01)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 rounded w-24"
          type="number"
          min={1}
          placeholder="Vol"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          Add
        </button>
      </form>

      {books && books.length > 0 ? (
        <ul className="space-y-2">
          {books.map((b) => (
            <li
              key={b.id}
              className="bg-white border p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-xs text-gray-500">
                  Vol {b.volume} · ID {b.id}
                </div>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteBook(b.id);
                    router.refresh();
                  })
                }
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No books yet.</p>
      )}
    </div>
  );
}
