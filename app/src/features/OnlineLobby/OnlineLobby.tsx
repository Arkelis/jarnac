import { teamsPresenceState } from "db/realtime";
import { useEffect, useMemo, useState } from "react";
import EnterName from "./EnterName";
import * as uuid from "uuid";
import { Team, TeamsToDefine } from "types";

interface Props {
  gameId: string;
  team: Team | null;
  setTeam: (team: Team | null) => void;
  name?: string;
  setName: (name: string) => void;
  teamNames?: TeamsToDefine;
}

interface UserPayload {
  id: string;
  name: string;
  team?: Team;
}

function OnlineLobby({
  gameId,
  team,
  setTeam,
  teamNames,
  name,
  setName,
}: Props) {
  const userId = useMemo(() => uuid.v4(), []);
  const [users, setUsers] = useState<UserPayload[]>();
  const [isReady, setIsReady] = useState(false);
  const gameUrl = `http://localhost:3000/en-ligne/${gameId}`;

  useEffect(() => {
    if (name === undefined) return;
    const channel = teamsPresenceState({ gameId });
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
          await channel.track({ id: userId, name, team, isReady });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [name, team, isReady]);

  if (name === undefined) return <EnterName onSubmitName={setName} />;
  return (
    <div>
      <h1>Lobby</h1>
      Joueurs présents :
      <ul>
        {users?.map(({ id, name, team }) =>
          team === undefined ? <li key={id}>{name}</li> : null
        )}
      </ul>
      {teamNames?.team1 || "Équipe 1"}
      <button disabled={isReady} onClick={() => setTeam(Team.team1)}>
        Rejoindre
      </button>
      <ul>
        {users?.map(({ id, name, team }) =>
          team === Team.team1 ? <li key={id}>{name}</li> : null
        )}
      </ul>
      {teamNames?.team2 || "Équipe 2"}
      <button disabled={isReady} onClick={() => setTeam(Team.team2)}>
        Rejoindre
      </button>
      <ul>
        {users?.map(({ id, name, team }) =>
          team === Team.team2 ? <li key={id}>{name}</li> : null
        )}
      </ul>
      <button onClick={() => setIsReady((s) => !s)}>
        {!isReady ? "Je suis prêt" : "Je ne suis pas prêt"}
      </button>
      <p>Copiez ce lien pour inviter vos amis dans la partie : {gameUrl}</p>
    </div>
  );
}

export default OnlineLobby;
