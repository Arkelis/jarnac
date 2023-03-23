import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "db/client"
import { useCallback } from "react"
import { Team, TeamsToDefine } from "types"

interface UseFetchTeamNamesParams {
  gameId: string
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

export function useUpdateTeamNames({ teams: currentTeams, gameId }: UseUpdateTeamNamesParams) {
  const { mutate } = useMutation({
    mutationFn: async (teamNames: TeamsToDefine) => {
      const { data, error } = await supabase
        .from("games")
        .update({ team_names: teamNames })
        .eq("id", gameId)
        .select()
        .order("id")
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
    retry: false,
  })

  const updateTeamLetter = useCallback(
    (team: Team) => (letter: string) => {
      if (!currentTeams) return
      mutate({ ...currentTeams, [team]: { ...currentTeams[team], letter } })
    },
    [currentTeams, mutate]
  )

  const updateTeamName = useCallback(
    ({ team, name }: { team: Team; name: string }) => {
      if (!currentTeams) return
      mutate({ ...currentTeams, [team]: { ...currentTeams[team], name } })
    },
    [currentTeams, mutate]
  )

  const updateFirstTeam = useCallback(
    (team: Team) => {
      if (!currentTeams) return
      mutate({ ...currentTeams, firstTeam: team })
    },
    [currentTeams, mutate]
  )

  return { updateTeamLetter, updateTeamName, updateFirstTeam }
}
