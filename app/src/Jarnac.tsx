import { useState } from "react";
import FirstPlayerDraw from "./features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "./features/Game/Game";
import { TeamsToDefine } from "./types";

function Jarnac() {
  const [teams, setTeams] = useState<TeamsToDefine>({
    team1: undefined,
    team2: undefined,
  });

  const { team1, team2 } = teams;

  if (team1 === undefined || team2 === undefined)
    return (
      <FirstPlayerDraw
        onAllPlayersSorted={(sortedTeams) => {
          setTeams(sortedTeams);
        }}
      />
    );

  return <Game teams={{ team1, team2 }} />;
}

export default Jarnac;
