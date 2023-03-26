import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "db/client"
import { Bag } from "models/bag"

interface UseFetchBagParams {
  gameId?: string
  onSuccess: (bag: Bag) => void
  enabled?: boolean
}

export function useFetchBag({ gameId, enabled = true, onSuccess }: UseFetchBagParams) {
  return useQuery({
    queryKey: ["games", gameId, "bag"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("bag")
        .eq("id", gameId)
        .limit(1)
        .single()
      if (error) throw error
      return data.bag as Bag
    },
    enabled: Boolean(gameId) && enabled,
    retry: false,
    onSuccess,
  })
}

interface UseUpdateBagParams {
  gameId?: string
}

export function useUpdateBag({ gameId }: UseUpdateBagParams) {
  return useMutation({
    mutationFn: async (bag: Bag) => {
      if (!gameId) return
      const { data, error } = await supabase
        .from("games")
        .update({ bag })
        .eq("id", gameId)
        .select("bag")
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return data.bag as Bag
    },
    retry: false,
  })
}
