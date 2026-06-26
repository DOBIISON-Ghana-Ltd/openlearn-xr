"use client";

import Link from "next/link";
import { books, modules } from "@/lib/constants/data";
import { Button } from "@/components/ui/button";
import { nuqs } from "@/lib/utils/nuqs";
import BookCard from "@/components/particles/book-card";
import ModuleCard from "@/components/particles/module-card";

export default function Page() {
  const [{ book: bookId }] = nuqs.getStates('library');

  const selectedBook = bookId ? books.find(b => b.id === bookId) : null;
  const filteredModules = selectedBook ? modules.filter(m => m.bookId === bookId) : [];

  return (
    <div className="size-full">
      {/* HEADER */}
      <div className="w-full h-24 px-5 pb-4 gap-1 flex flex-col justify-end items-start">
        {!selectedBook ? null : (
          <Button variant="secondary" size="xs" render={<Link href="/app/library" />}>
            Back
          </Button>
        )}
        <h1 className="text-2xl font-heading font-normal text-foreground">
          Library {selectedBook ? ` / ${selectedBook.subject} / ${selectedBook.grade}` : null}
        </h1>
      </div>
      {/* CONTENT */}

      <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {selectedBook ? (
          <>
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} {...module} mode="library" />
            ))}
          </>
        ) : (
          <>
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}