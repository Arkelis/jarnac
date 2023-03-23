import { useMemo } from "react";
import { useBag } from "features/bag";
import DrawLetter from "./DrawLetter";
import { Team, TeamsToDefine } from "types";

interface Props {
  teams: TeamsToDefine;
  onAllPlayersSorted: (firstTeam: Team) => void;
  onlineTeam?: Team | null;
  onSetLetter: (team: Team) => (letter: string) => void;
}

const canClick = (team: Team, onlineTeam?: Team | null) => {
  if (onlineTeam === undefined) return true;
  if (onlineTeam === null) return false;
  return team === onlineTeam;
};

function FirstPlayerDraw({ teams, onAllPlayersSorted, onlineTeam, onSetLetter }: Props) {
  const { draw } = useBag();

  const firstTeam = useMemo(() => {
    if (!teams.team1.letter || !teams.team2.letter) return undefined;
    return teams.team1.letter.localeCompare(teams.team2.letter) < 0 ? Team.team1 : Team.team2;
  }, [teams.team1.letter, teams.team2.letter]);

  return (
    <>
      <DrawLetter
        key={1}
        letter={teams.team1.letter}
        name={teams.team1.name}
        draw={draw}
        onDrawn={onSetLetter(Team.team1)}
        interactionsEnabled={canClick(Team.team1, onlineTeam)}
      />
      <DrawLetter
        key={2}
        letter={teams.team2.letter}
        name={teams.team2.name}
        draw={draw}
        onDrawn={onSetLetter(Team.team2)}
        interactionsEnabled={canClick(Team.team2, onlineTeam)}
      />
      {firstTeam && (
        <>
          <p>Première équipe: {teams[firstTeam].name}</p>
          <button onClick={() => onAllPlayersSorted(firstTeam)}>Commencer !</button>
        </>
      )}
    </>
  );
}

export default FirstPlayerDraw;
