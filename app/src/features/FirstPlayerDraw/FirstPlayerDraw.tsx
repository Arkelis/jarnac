import { useMemo, useState } from "react";
import { useBag } from "features/bag";
import DrawLetter from "./DrawLetter";
import { Team, Teams } from "types";

interface Props {
  teamNames: Teams;
  onAllPlayersSorted: (firstTeam: Team) => void;
  onlineTeam?: Team | null;
}

interface TeamLetters {
  team1?: string;
  team2?: string;
}

const canClick = (team: Team, onlineTeam?: Team | null) => {
  if (onlineTeam === undefined) return true;
  if (onlineTeam === null) return false;
  return team === onlineTeam;
};

function FirstPlayerDraw({ teamNames, onAllPlayersSorted, onlineTeam }: Props) {
  const { draw } = useBag();
  // TODO: Synchronize team letters with team names to select first team
  const [letters, setLetters] = useState<TeamLetters>({
    team1: undefined,
    team2: undefined,
  });

  const firstTeam = useMemo(() => {
    if (!letters.team1 || !letters.team2) return undefined;
    return letters.team1.localeCompare(letters.team2) < 0
      ? Team.team1
      : Team.team2;
  }, [letters]);

  return (
    <>
      <DrawLetter
        key={1}
        name={teamNames.team1}
        draw={draw}
        onDrawn={(letter: string) =>
          setLetters((ls) => ({ ...ls, team1: letter }))
        }
        interactionsEnabled={canClick(Team.team1, onlineTeam)}
      />
      <DrawLetter
        key={2}
        name={teamNames.team2}
        draw={draw}
        onDrawn={(letter: string) =>
          setLetters((ls) => ({ ...ls, team2: letter }))
        }
        interactionsEnabled={canClick(Team.team2, onlineTeam)}
      />
      {firstTeam && (
        <>
          <p>Première équipe: {teamNames[firstTeam]}</p>
          <button onClick={() => onAllPlayersSorted(firstTeam)}>
            Commencer !
          </button>
        </>
      )}
    </>
  );
}

export default FirstPlayerDraw;
