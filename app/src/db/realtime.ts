import { supabase } from "db/client";

export function teamsPresenceState({ gameId }: { gameId: string }) {
  return supabase.channel(gameId, {
    config: { presence: { key: "presences" } },
  });
}

export function gameStateChanges({ gameId }: { gameId: string }) {
  return supabase.channel(gameId);
}

export function teamsNamesChanges({ gameId }: { gameId: string }) {
  return supabase.channel(gameId);
}
