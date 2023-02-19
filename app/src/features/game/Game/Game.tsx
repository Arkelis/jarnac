import Set from "features/game/Set/Set";
import { Team, Teams } from "types";
import { useGameActions } from "./useGameActions";

interface Props {
  teamNames: Teams;
  firstTeam: Team;
}

function Game({ teamNames, firstTeam }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames;
  const { gameState, ...actions } = useGameActions({
    team1: teamOneName,
    team2: teamTwoName,
    firstTeam,
  });

  return (
    <>
      <div>
        <Set team={Team.team1} gameState={gameState} {...actions} />
        <Set team={Team.team2} gameState={gameState} {...actions} />
      </div>
    </>
  );
}

export default Game;
