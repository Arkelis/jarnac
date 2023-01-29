import Set from "features/Set/Set";
import { Team, Teams } from "types";
import { useGameActions } from "./useGameActions";

interface Props {
  teamNames: Teams;
}

function Game({ teamNames }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames;
  const {
    gameState: { team1, team2, pendingWord },
    ...actions
  } = useGameActions({ team1: teamOneName, team2: teamTwoName });
  return (
    <>
      <div>
        <p>Plateau de l&apos;équipe {team1.name}</p>
        <Set
          team={Team.team1}
          possibleActions={team1.possibleActions}
          letters={team1.letters}
          lines={team1.board}
          pendingWord={pendingWord}
          {...actions}
        />
        <p>Plateau de l&apos;équipe {team2.name}</p>
        <Set
          team={Team.team2}
          possibleActions={team2.possibleActions}
          letters={team2.letters}
          lines={team2.board}
          pendingWord={pendingWord}
          {...actions}
        />
      </div>
    </>
  );
}

export default Game;
