import { useMutation, useQuery } from "@tanstack/react-query";
import { GameState } from "features/game/Game/useGameActions";
import { supabase } from "db/client";
import { Team, Teams, TeamsToDefine } from "types";
import { useCallback } from "react";

interface UseCreateGameParams {
  onSuccess: (id: string) => void;
}

export function useCreateGame({ onSuccess }: UseCreateGameParams) {
  return useMutation<string>({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .insert([
          {
            team_names: {
              team1: { name: "Charme" },
              team2: { name: "Ébène" },
            },
          },
        ])
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess,
  });
}

interface Game {
  id: string;
  state: GameState;
}

interface UseFetchGameParams {
  id?: string;
}

export function useFetchGame({ id }: UseFetchGameParams) {
  return useQuery<Game>({
    queryKey: ["games", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select()
        .eq("id", id)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
    retry: false,
  });
}

interface UseFetchTeamNamesParams {
  gameId: string;
}

export function useFetchTeamNames({ gameId }: UseFetchTeamNamesParams) {
  return useQuery({
    queryKey: ["games", gameId, "team_names"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("team_names")
        .eq("id", gameId)
        .limit(1)
        .single();
      if (error) throw error;
      return data.team_names as TeamsToDefine;
    },
    enabled: Boolean(gameId),
    retry: false,
  });
}

interface UseUpdateTeamNamesParams {
  gameId: string;
  teams?: TeamsToDefine;
}

export function useUpdateTeamNames({
  teams: currentTeams,
  gameId,
}: UseUpdateTeamNamesParams) {
  const { mutate } = useMutation({
    mutationFn: async (teamNames: TeamsToDefine) => {
      const { data, error } = await supabase
        .from("games")
        .update({ team_names: teamNames })
        .eq("id", gameId)
        .select()
        .order("id")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    retry: false,
  });

  const updateTeamLetter = useCallback(
    (team: Team) => (letter: string) => {
      if (!currentTeams) return;
      mutate({ ...currentTeams, [team]: { ...currentTeams[team], letter } });
    },
    [currentTeams, mutate]
  );

  const updateTeamName = useCallback(
    ({ team, name }: { team: Team; name: string }) => {
      if (!currentTeams) return;
      mutate({ ...currentTeams, [team]: { ...currentTeams[team], name } });
    },
    [currentTeams, mutate]
  );

  const updateFirstTeam = useCallback(
    (team: Team) => {
      if (!currentTeams) return;
      mutate({ ...currentTeams, firstTeam: team });
    },
    [currentTeams, mutate]
  );

  return { updateTeamLetter, updateTeamName, updateFirstTeam };
}
