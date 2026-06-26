"use client";

import ModuleCard from "@/components/particles/module-card";
import { modules, books } from "@/lib/constants/data";

export default function Page() {
  return (
    <div className="size-full">
      {/* HEADER */}
      <div className="w-full h-24 px-5 pb-4 gap-1 flex flex-col justify-end items-start">
        <h1 className="text-2xl font-heading font-normal text-foreground">
          Modules
        </h1>
      </div>
      {/* CONTENT */}

      <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {modules.map((module) => {
          const book = books.find((b) => b.id === module.bookId);
          return (
            <ModuleCard 
              key={module.id} 
              {...module} 
              subject={book?.subject} 
              grade={book?.grade} 
            />
          );
        })}
      </div>
    </div>
  )
}