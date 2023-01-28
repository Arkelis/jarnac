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
    ...actions
  } = useGameActions({ team1: teamOneName, team2: teamTwoName });
  return (
    <>
      <p>C&apos;est le tour de {teamNames[currentTeam]}</p>
      <div>
        <p>Plateau de l&apos;équipe {team1.name}</p>
        <Set
          team={Team.team1}
          playing={currentTeam === Team.team1}
          letters={team1.letters}
          lines={team1.board}
          {...actions}
        />
        <p>Plateau de l&apos;équipe {team2.name}</p>
        <Set
          team={Team.team2}
          playing={currentTeam === Team.team2}
          letters={team2.letters}
          lines={team2.board}
          {...actions}
        />
      </div>
    </>
  );
}

export default Game;
