import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { useState } from "react";
import { Team, TeamsToDefine } from "types";

interface Props {
  id: string;
}

function OnlineGame({ id }: Props) {
  const [teamNames, setTeamNames] = useState<TeamsToDefine>();
  const [onlineTeam, setOnlineTeam] = useState<Team | null>(null);
  const [name, setName] = useState<string>();

  return (
    <>
      <OnlineLobby
        gameId={id}
        team={onlineTeam}
        setTeam={setOnlineTeam}
        name={name}
        setName={setName}
      />
      {name === undefined ? null : teamNames === undefined ? (
        <FirstPlayerDraw
          onlineTeam={onlineTeam}
          onAllPlayersSorted={setTeamNames}
        />
      ) : (
        <Game
          firstTeam={teamNames.firstTeam}
          teamNames={{ team1: teamNames.team1, team2: teamNames.team2 }}
        />
      )}
    </>
  );
}

export default OnlineGame;
