import { useCallback, useMemo, useState } from "react";
import { opponent, Team } from "types";

export function useTeamTurn() {
  const [currentTeam, setCurrentTeam] = useState<Team>(Team.team1);
  const changeTurn = useCallback(() => setCurrentTeam((t) => opponent(t)), [setCurrentTeam]);
  const opponentTeam = useMemo(() => opponent(currentTeam), [currentTeam]);

  return { currentTeam, opponentTeam, changeTurn };
}
