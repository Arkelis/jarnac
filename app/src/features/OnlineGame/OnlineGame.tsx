import { teamsPresenceState } from "db/realtime";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { useEffect, useMemo, useState } from "react";
import { Team, TeamsToDefine } from "types";
import * as uuid from "uuid";

export interface UserPayload {
  id: string;
  name: string;
  team?: Team;
}

interface Props {
  id: string;
}

function OnlineGame({ id }: Props) {
  const [teamNames, setTeamNames] = useState<TeamsToDefine>();
  const [onlineTeam, setOnlineTeam] = useState<Team | null>(null); // team of local player
  const [name, setName] = useState<string>();
  const [users, setUsers] = useState<UserPayload[]>([]);
  const userId = useMemo(() => uuid.v4(), []);
  const gameIsOngoing = useMemo(() => {
    const teams = users.map((user) => user.team);
    return (
      teams.every((t) => t === Team.team1) ||
      teams.every((t) => t === Team.team2)
    );
  }, [users]);

  useEffect(() => {
    if (name === undefined) return;
    const channel = teamsPresenceState({ gameId: id });
    channel
      .on<UserPayload>(
        "presence",
        { event: "join" },
        ({ key, newPresences, currentPresences }) => {
          if (key !== "presences") return;
          setUsers([...currentPresences, ...newPresences]);
        }
      )
      .on<UserPayload>(
        "presence",
        { event: "leave" },
        ({ key, currentPresences }) => {
          if (key !== "presences") return;
          setUsers(currentPresences);
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED")
          await channel.track({ id: userId, name, team: onlineTeam });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [name, onlineTeam]);

  return (
    <>
      <OnlineLobby
        users={users}
        gameId={id}
        team={onlineTeam}
        teamNames={teamNames}
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
