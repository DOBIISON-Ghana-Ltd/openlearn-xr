"use client";

interface ClientPageProps {
  moduleId: string;
}

export default function ClientPage({ moduleId }: ClientPageProps) {
  return (
    <div className="size-full space-y-5 pb-7 bg-red-400">
      <div className="w-full py-5 px-6 ">
        <h1 className="text-xl font-semibold text-foreground">
          Module {moduleId}
        </h1>
      </div>
    </div>
  );
}
