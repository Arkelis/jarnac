import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "db/client"
import { GameState } from "models/game"

interface UseCreateGameParams {
  onSuccess: (id: string) => void
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
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess,
  })
}

interface Game {
  id: string
  state: GameState
}

interface UseFetchGameParams {
  id?: string
}

export function useFetchGame({ id }: UseFetchGameParams) {
  return useQuery<Game>({
    queryKey: ["games", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select().eq("id", id).limit(1).single()
      if (error) throw error
      return data
    },
    enabled: Boolean(id),
    retry: false,
  })
}
