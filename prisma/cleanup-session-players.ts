import "dotenv/config";
import prisma from "../src/adapters/db/client";

async function cleanupSessionPlayers() {
  console.log("🔍 Fetching all session players from the database...");

  const players = await prisma.sessionPlayer.findMany({
    orderBy: [
      { sessionId: "asc" },
      { joinedAt: "asc" },
      { id: "asc" },
    ],
  });

  console.log(`📊 Found ${players.length} session player records.`);

  const sessionNameCounts = new Map<string, Set<string>>();
  let updatedCount = 0;

  for (const player of players) {
    const sessionId = player.sessionId;
    if (!sessionNameCounts.has(sessionId)) {
      sessionNameCounts.set(sessionId, new Set<string>());
    }

    const seenNames = sessionNameCounts.get(sessionId)!;

    // 1. Fallback for empty or whitespace-only name
    let cleanName = player.name ? player.name.trim() : "";
    if (!cleanName) {
      cleanName = "Player";
    }

    // 2. Make sure name is unique within this session (case-insensitive check)
    let uniqueName = cleanName;
    let counter = 2;
    while (seenNames.has(uniqueName.toLowerCase())) {
      uniqueName = `${cleanName} (${counter})`;
      counter++;
    }

    seenNames.add(uniqueName.toLowerCase());

    // 3. Update if the name was modified
    if (uniqueName !== player.name) {
      await prisma.sessionPlayer.update({
        where: { id: player.id },
        data: { name: uniqueName },
      });
      console.log(`✏️ Updated [Session: ${sessionId}] Player "${player.name}" -> "${uniqueName}"`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Cleanup completed! Updated ${updatedCount} player records.`);
}

cleanupSessionPlayers()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
