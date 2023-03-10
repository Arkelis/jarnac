import { useMutation, useQuery } from "@tanstack/react-query";
import { GameState } from "features/game/Game/useGameActions";
import { supabase } from "db/client";
import { Teams } from "types";

interface UseCreateGameParams {
  onSuccess: (id: string) => void;
}

export function useCreateGame({ onSuccess }: UseCreateGameParams) {
  return useMutation<string>({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .insert([{}])
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

export function useFetchTeamNames({ id }: UseFetchGameParams) {
  return useQuery<Teams>({
    queryKey: ["games", id, "team_names"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("team_names")
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

interface UseUpdateTeamNamesParam {
  id: string;
}

export function useUpdateTeamNames({ id }: UseUpdateTeamNamesParam) {
  return useMutation({
    mutationFn: async (teamNames: Teams) => {
      const { data, error } = await supabase
        .from("games")
        .update({ team_names: teamNames })
        .eq("id", id)
        .select()
        .order("id")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    retry: false,
  });
}
