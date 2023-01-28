import { useState } from "react";
import FirstPlayerDraw from "./features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "./features/Game/Game";
import { TeamsToDefine } from "./types";

function Jarnac() {
  const [teams, setTeams] = useState<TeamsToDefine>({
    team1: "Louise", // undefined
    team2: "Guillaume", // undefined
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

  return <Game teamNames={{ team1, team2 }} />;
}

export default Jarnac;
