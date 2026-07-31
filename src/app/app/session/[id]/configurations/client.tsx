"use client";

interface ClientPageProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: ClientPageProps) {
  return (
    <div className="size-full pb-7">
      <div className="w-full py-5 px-5 ">
        <h1 className="text-xl font-normal text-foreground">
          Configurations
        </h1>
      </div>
      <div className="w-full px-5 space-y-7">
      </div>
    </div>
  );
}
