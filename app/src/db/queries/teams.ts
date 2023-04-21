import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "db/client"
import { GameState, initialGame } from "models/game"
import { useCallback } from "react"
import { Team, TeamsToDefine } from "types"

interface UseFetchTeamNamesParams {
  gameId?: string
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
        .single()
      if (error) throw error
      return data.team_names as TeamsToDefine
    },
    enabled: Boolean(gameId),
    retry: false,
  })
}

interface UseUpdateTeamNamesParams {
  gameId: string
  teams?: TeamsToDefine
}

interface MutateTeamNamesParams {
  teamNames: TeamsToDefine
  game?: GameState
}

export function useUpdateTeamNames({ teams: currentTeams, gameId }: UseUpdateTeamNamesParams) {
  const queryClient = useQueryClient()
  const queryKey = ["games", gameId, "team_names"]

  const { mutate } = useMutation({
    mutationFn: async ({ teamNames, game }: MutateTeamNamesParams) => {
      const { data, error } = await supabase
        .from("games")
        .update({ team_names: teamNames, game_state: game })
        .eq("id", gameId)
        .select()
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
    onMutate: async (newTeams) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTeams = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, newTeams.teamNames)
      return { previousTeams }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousTeams)
    },
    retry: false,
  })

  const updateTeamLetter = useCallback(
    (team: Team) => (letter: string) => {
      if (!currentTeams) return
      mutate({ teamNames: { ...currentTeams, [team]: { ...currentTeams[team], letter } } })
    },
    [currentTeams, mutate]
  )

  const updateTeamName = useCallback(
    ({ team, name }: { team: Team; name: string }) => {
      if (!currentTeams) return
      mutate({ teamNames: { ...currentTeams, [team]: { ...currentTeams[team], name } } })
    },
    [currentTeams, mutate]
  )

  const updateFirstTeamAndInitGame = useCallback(
    (firstTeam: Team) => {
      if (!currentTeams) return
      mutate({ teamNames: { ...currentTeams, firstTeam }, game: initialGame({ firstTeam }) })
    },
    [currentTeams, mutate]
  )

  return { updateTeamLetter, updateTeamName, updateFirstTeamAndInitGame }
}
