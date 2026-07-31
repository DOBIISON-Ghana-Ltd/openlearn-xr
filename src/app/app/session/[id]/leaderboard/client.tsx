"use client";

interface ClientPageProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: ClientPageProps) {
  return (
    <div className="size-full pb-7">
      <div className="w-full py-5 px-5 ">
        <h1 className="text-xl font-normal text-foreground">
          Leaderboard
        </h1>
      </div>
      <div className="w-full px-5 space-y-7">
        <TopPlayers data={[]} />
        <LeaderboardTable data={[]} />
      </div>
    </div>
  );
};

type ITopPlayers = {
  data: any[]
}
function TopPlayers(props: ITopPlayers) {
  return (
    <div className="w-full h-44 bg-red-50/50 flex-center gap-4">
      Top three players
    </div>
  )
};

type ILeaderboardTable = {
  data: any[]
}
function LeaderboardTable(props: ILeaderboardTable) {
  return (
    <div className="w-full h-44 bg-red-50/50 flex-center gap-4">
      The Leaderboard Table
    </div>
  )
}
