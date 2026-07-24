"use client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookIcon, BookTextIcon, LoaderIcon, PlusIcon, RouteIcon } from "lucide-react";
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import { match } from "ts-pattern";

interface ClientPageProps {
  collectionId: string;
}

type IDocument = Infer["AdminCollectionGetDocuments"]["res"][number];

export default function Documents({ collectionId }: ClientPageProps) {
  const { data: documents, isLoading } = useApi.query("admin:collection:get:documents", collectionId);

  const status = isLoading ? "loading" : documents && documents.length > 0 ? "success" : "empty";

  return (
    <div className="sticky right-0 top-8 self-start w-lg border-l flex flex-col h-[calc(100dvh-(--spacing(14)))] z-40 bg-background">
      {/* HEADER */}
      <div className="w-full h-10 flex flex-center justify-between px-4">
        <div className="">
          <p className="text-sm-m font-normal text-foreground">Documents</p>
        </div>
        <div className="">
          <Button size={"xs"} variant={"outline"}>
            <PlusIcon />
            New Doc
          </Button>
        </div>
      </div>
      {/* CONTENT */}
      <div className="flex-1 w-full overflow-hidden">
        {match(status)
          .with("loading", () => <LoadingState />)
          .with("empty", () => <EmptyState />)
          .with("success", () => <ContentState documents={documents || []} />)
          .exhaustive()}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full flex-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookIcon />
          </EmptyMedia>
          <EmptyTitle>No documents attached</EmptyTitle>
          <EmptyDescription>Add a document to this collection to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="xs" variant="outline">
              <PlusIcon />
              New Doc
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="size-full flex-center">
      <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

type IContentState = {
  documents: IDocument[];
};

function ContentState({ documents }: IContentState) {
  return (
    <ScrollArea className="size-full">

    </ScrollArea>
  );
}
