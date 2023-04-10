import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "db/client"
import { initialBag } from "models/bag"
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
            bag: initialBag(),
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

interface UseFetchGameParams {
  gameId?: string
  onSuccess?: (game: GameState) => void
}

export function useFetchGame({ gameId, onSuccess }: UseFetchGameParams) {
  return useQuery({
    queryKey: ["games", gameId, "game"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("game_state")
        .eq("id", gameId)
        .limit(1)
        .single()
      if (error) throw error
      return data.game_state as GameState
    },
    enabled: Boolean(gameId),
    retry: false,
    onSuccess,
  })
}

interface UseUpdateGameParams {
  gameId?: string
}

export function useUpdateGame({ gameId }: UseUpdateGameParams) {
  const queryClient = useQueryClient()
  const queryKey = ["games", gameId, "game"]

  return useMutation({
    mutationFn: async (game: GameState) => {
      if (!gameId) return
      const { data, error } = await supabase
        .from("games")
        .update({ game_state: game })
        .eq("id", gameId)
        .select("game_state")
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return data.game_state as GameState
    },
    onMutate: async (gameState) => {
      await queryClient.cancelQueries({ queryKey })
      const previousState = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, gameState)
      return { previousState }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousState)
    },
    retry: false,
  })
}
