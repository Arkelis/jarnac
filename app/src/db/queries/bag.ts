import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "db/client"
import { Bag } from "features/bag"
import { TeamsToDefine } from "types"

interface UseFetchBagParams {
  gameId: string
}

export function useFetchBag({ gameId }: UseFetchBagParams) {
  return useQuery({
    queryKey: ["games", gameId, "team_names"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("team_names")
        .eq("id", gameId)
        .limit(1)
        .single()
      if (error) throw error
      return data.team_names as TeamsToDefine
    },
    enabled: Boolean(gameId),
    retry: false,
  })
}

interface UseUpdateBagParams {
  gameId: string
  teams?: TeamsToDefine
}

export function useUpdateBagNames({ gameId }: UseUpdateBagParams) {
  return useMutation({
    mutationFn: async (bag: Bag) => {
      const { data, error } = await supabase
        .from("games")
        .update({ bag })
        .eq("id", gameId)
        .select("bag")
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
    retry: false,
  })
}
