import { useCallback, useState } from "react";
import { opponent, Team } from "types";

export function useTeamTurn() {
  const [currentTeam, setCurrentTeam] = useState<Team>(Team.team1);
  const changeTurn = useCallback(
    () => setCurrentTeam((t) => opponent(t)),
    [setCurrentTeam]
  );

  return { currentTeam, changeTurn };
}
