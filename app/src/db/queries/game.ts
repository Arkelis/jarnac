import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "db/client"
import { Bag, initialBag } from "models/bag"
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

interface GamePayload {
  gameState: GameState
  bag: Bag
}

interface UseFetchGameParams {
  gameId?: string
  onSuccess?: (game: GamePayload) => void
}

export function useFetchGame({ gameId, onSuccess }: UseFetchGameParams) {
  return useQuery({
    queryKey: ["games", gameId, "game"],
    queryFn: async (): Promise<GamePayload> => {
      const { data, error } = await supabase
        .from("games")
        .select("game_state, bag")
        .eq("id", gameId)
        .limit(1)
        .single()
      if (error) throw error
      return { gameState: data.game_state, bag: data.bag }
    },
    enabled: Boolean(gameId),
    retry: false,
    onSuccess,
  })
}

interface UseUpdateGameParams {
  gameId?: string
}

interface GameUpdatePayload {
  gameState: GameState
  bag?: Bag
}

interface GameUpdateRequestBody {
  game_state: GameState
  bag?: Bag
}

export function useUpdateGame({ gameId }: UseUpdateGameParams) {
  const queryClient = useQueryClient()
  const queryKey = ["games", gameId, "game"]

  return useMutation({
    mutationFn: async (game: GameUpdatePayload) => {
      if (!gameId) return

      const updatePayload = { game_state: game.gameState } as GameUpdateRequestBody
      if (game.bag !== undefined) updatePayload["bag"] = game.bag

      const { data, error } = await supabase
        .from("games")
        .update(updatePayload)
        .eq("id", gameId)
        .select("game_state, bag")
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return { gameState: data.game_state, bag: data.bag }
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
