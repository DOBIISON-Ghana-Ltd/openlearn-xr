"use client";

interface ClientPageProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: ClientPageProps) {
  return (
    <div className="size-full pb-7">
      <div className="w-full py-5 px-5 ">
        <h1 className="text-xl font-normal text-foreground">
          Analytics
        </h1>
      </div>
      <div className="w-full px-5 space-y-7">
        <Analytics1 />
        <Analytics2 />
        <Analytics3 />
      </div>
    </div>
  );
};

function Analytics1() {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-64 bg-background border rounded-md flex-center">

      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Completion rate
        </p>
      </div>
    </div>
  );
}

function Analytics2() {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-64 bg-background border rounded-md flex-center">

      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Completion rate
        </p>
      </div>
    </div>
  );
}

function Analytics3() {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-64 bg-background border rounded-md flex-center">

      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Completion rate
        </p>
      </div>
    </div>
  );
}