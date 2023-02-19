import { useState } from "react";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import { TeamsToDefine } from "types";

function OfflineGame() {
  const [teams, setTeams] = useState<TeamsToDefine>();

  if (teams === undefined)
    return <FirstPlayerDraw onAllPlayersSorted={setTeams} />;

  const { team1, team2, firstTeam } = teams;
  return <Game teamNames={{ team1, team2 }} firstTeam={firstTeam} />;
}

export default OfflineGame;
