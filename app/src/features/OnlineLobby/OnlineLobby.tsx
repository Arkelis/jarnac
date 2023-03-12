import EnterName from "./EnterName";
import { Team, TeamsToDefine } from "types";
import { UserPayload } from "features/OnlineGame/OnlineGame";

interface Props {
  gameId: string;
  team: Team | null;
  setTeam: (team: Team | null) => void;
  name?: string;
  setName: (name: string) => void;
  teamNames?: TeamsToDefine;
  users: UserPayload[];
}

function OnlineLobby({
  gameId,
  users,
  setTeam,
  teamNames,
  name,
  setName,
}: Props) {
  const gameUrl = `http://localhost:3000/en-ligne/${gameId}`;

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
      <button onClick={() => setTeam(Team.team1)}>Rejoindre</button>
      <ul>
        {users?.map(({ id, name, team }) =>
          team === Team.team1 ? <li key={id}>{name}</li> : null
        )}
      </ul>
      {teamNames?.team2 || "Équipe 2"}
      <button onClick={() => setTeam(Team.team2)}>Rejoindre</button>
      <ul>
        {users?.map(({ id, name, team }) =>
          team === Team.team2 ? <li key={id}>{name}</li> : null
        )}
      </ul>
      <p>Copiez ce lien pour inviter vos amis dans la partie : {gameUrl}</p>
    </div>
  );
}

export default OnlineLobby;
