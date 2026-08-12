// Strongly-typed event registry mapping
export type RealtimeEventMap = {
  "session:started": { sessionId: string };
  "session:ended": { sessionId: string };
  "player:joined": { participantId: string; name: string };
  "player:left": { participantId: string; name: string };
  "tab:change": { currentTab: number };
  // Add other events here as the app grows
};

export type RealtimeEventName = keyof RealtimeEventMap;
