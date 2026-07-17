"use client";

interface ClientPageProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: ClientPageProps) {
  return (
    <div className="size-full space-y-5 pb-7">
      <div className="w-full py-5 px-6 ">
        <h1 className="text-xl font-semibold text-foreground">
          Settings
        </h1>
      </div>
    </div>
  );
}
