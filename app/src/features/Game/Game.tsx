import Set from "features/Set/Set";
import { Team, Teams } from "types";
import { useGameActions } from "./useGameActions";

interface Props {
  teamNames: Teams;
}

function Game({ teamNames }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames;
  const {
    gameState: { team1, team2 },
    currentTeam,
    init,
  } = useGameActions({ team1: teamOneName, team2: teamTwoName });
  return (
    <>
      <p>C&apos;est le tour de {teamNames[currentTeam]}</p>
      <div>
        <p>Plateau de l&apos;équipe {team1.name}</p>
        <Set
          letters={team1.letters}
          lines={team1.board}
          takeSixLetters={() => init(Team.team1)}
        />
        <p>Plateau de l&apos;équipe {team2.name}</p>
        <Set
          letters={team2.letters}
          lines={team2.board}
          takeSixLetters={() => init(Team.team2)}
        />
      </div>
    </>
  );
}

export default Game;
