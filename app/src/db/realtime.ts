import { supabase } from "db/client";
import { useEffect, useMemo } from "react";
import { Team } from "types";
import * as uuid from "uuid";

export interface UserPayload {
  id: string;
  name: string;
  team?: Team;
}

interface UseTeamsPresenceStateParams {
  gameId: string;
  name?: string;
  setUsers: (users: UserPayload[]) => void;
  onlineTeam: Team | null;
}

export function useTeamsPresence({
  gameId,
  name,
  setUsers,
  onlineTeam,
}: UseTeamsPresenceStateParams) {
  const userId = useMemo(() => uuid.v4(), []);

  useEffect(() => {
    if (name === undefined) return;
    const channel = supabase.channel(`${gameId}:presence`, {
      config: { presence: { key: "presences" } },
    });
    channel
      .on<UserPayload>(
        "presence",
        { event: "join" },
        ({ key, newPresences, currentPresences }) => {
          if (key !== "presences") return;
          setUsers([...currentPresences, ...newPresences]);
        }
      )
      .on<UserPayload>(
        "presence",
        { event: "leave" },
        ({ key, currentPresences }) => {
          if (key !== "presences") return;
          setUsers(currentPresences);
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED")
          await channel.track({ id: userId, name, team: onlineTeam });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [name, onlineTeam]);
}

export function gameStateChanges({ gameId }: { gameId: string }) {
  return supabase.channel(`${gameId}:statechange`);
}

interface UseTeamsChangesParams {
  gameId: string;
  refetchTeams: () => void;
}

export function useTeamsNamesChanges({
  gameId,
  refetchTeams,
}: UseTeamsChangesParams) {
  useEffect(() => {
    const channel = supabase.channel(`${gameId}:teamchange`);
    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        () => refetchTeams()
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
}
