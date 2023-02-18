import { teamsPresenceState } from "db/queries";
import { useEffect, useMemo, useState } from "react";
import EnterName from "./EnterName";
import * as uuid from "uuid";

interface Props {
  gameId: string;
}

interface UserPayload {
  userId: string;
  userName: string;
}

function OnlineLobby({ gameId }: Props) {
  const [name, setName] = useState<string>();
  const userId = useMemo(() => uuid.v4(), []);
  const [users, setUsers] = useState<UserPayload[]>();
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
          setUsers(
            [...currentPresences, ...newPresences].map(
              ({ userId, userName }) => ({ userId, userName })
            )
          );
        }
      )
      .on<UserPayload>(
        "presence",
        { event: "leave" },
        ({ key, currentPresences }) => {
          if (key !== "presences") return;
          setUsers(
            currentPresences.map(({ userId, userName }) => ({
              userId,
              userName,
            }))
          );
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId,
            userName: name,
          });
        }
      });
  }, [name]);

  if (name === undefined) return <EnterName onSubmitName={setName} />;
  return (
    <div>
      <h1>Lobby</h1>
      Joueurs présents :
      <ul>
        {users?.map(({ userId, userName }) => (
          <li key={userId}>{userName}</li>
        ))}
      </ul>
      <p>Copiez ce lien pour inviter vos amis dans la partie : {gameUrl}</p>
    </div>
  );
}

export default OnlineLobby;
