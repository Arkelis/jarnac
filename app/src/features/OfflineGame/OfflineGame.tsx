import { useCallback, useState } from "react";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import { Team, TeamsToDefine } from "types";

function OfflineGame() {
  const [teams, setTeams] = useState<TeamsToDefine>({
    team1: { name: "Charme", letter: undefined },
    team2: { name: "Ébène", letter: undefined },
  });

  const setTeamLetter = useCallback(
    (team: Team) => (letter: string) => {
      setTeams((ts) => ({ ...ts, [team]: { ...ts[team], letter } }));
    },
    [setTeams]
  );

  const setFirstTeam = useCallback(
    (team: Team) => setTeams((ts) => ({ ...ts, firstTeam: team })),
    [setTeams]
  );

  const { team1, team2, firstTeam } = teams;

  if (firstTeam === undefined)
    return (
      <FirstPlayerDraw onAllPlayersSorted={setFirstTeam} onSetLetter={setTeamLetter} teams={teams} />
    );

  return <Game teamNames={{ team1: team1.name, team2: team2.name }} firstTeam={firstTeam} />;
}

export default OfflineGame;
