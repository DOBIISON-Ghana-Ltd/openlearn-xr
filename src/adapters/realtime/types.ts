// Strongly-typed event registry mapping
export type RealtimeEventMap = {
  "session:started": { joinCode: string };
  "session:ended": { joinCode: string };
  "player:joined": { participantId: string; name: string };
  "player:left": { participantId: string; name: string };
  "player:updated": { participantId: string; score: number };
  "tab:change": { currentTab: number };
  // Add other events here as the app grows
};

export type RealtimeEventName = keyof RealtimeEventMap;
