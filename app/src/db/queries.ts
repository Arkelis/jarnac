import { createClient } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GameState } from "features/game/Game/useGameActions";

const supabase = createClient(
  "https://kskatigvwydjkupclwep.supabase.co",
  process.env.REACT_APP_SUPABASE_API_KEY || ""
);

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

export function teamsPresenceState({ gameId }: { gameId: string }) {
  return supabase.channel(gameId, {
    config: { presence: { key: "presences" } },
  });
}
