"use client";

import Link from "next/link";
import { nuqs } from "@/lib/utils/nuqs";
import BookCard from "@/components/particles/book-card";
import ModuleCard from "@/components/particles/module-card";
import useApi from "@/data/hooks/use-api";
import { PATHS } from "@/lib/constants/paths";

export default function ClientPage() {
  const [{ collectionId }] = nuqs.getStates("sim:library");

  const { data: collections } = useApi.query("sim:collection:get:all");
  const { data: collectionData } = useApi.query(
    "sim:collection:get:modules",
    { collectionId },
    !!collectionId
  );

  return (
    <div className="size-full">
      {/* HEADER */}
      <div className="w-full px-5 py-4 gap-1 flex items-center justify-between">
        <h1 className="text-xl font-normal text-foreground">
          {collectionId ? (
            <>
              <Link href={PATHS.SIMS.LIBRARY.ROOT} className="hover:underline text-muted-foreground">
                Library
              </Link>
              {" / "}
              <span>{collectionData ? `${collectionData.name} • ${collectionData.level}` : "..."}</span>
            </>
          ) : (
            "Library"
          )}
        </h1>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {collectionId ? (
          <>
            {collectionData?.modules?.map((module) => (
              <ModuleCard key={module.id} mode="library" data={module} />
            ))}
          </>
        ) : (
          <>
            {collections?.map((collection) => (
              <BookCard key={collection.id} data={collection} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
