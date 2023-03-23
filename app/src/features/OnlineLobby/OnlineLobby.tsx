import EnterName from "./EnterName";
import { Team, Teams } from "types";
import { Dispatch, SetStateAction, useRef } from "react";
import { UserPayload } from "db/realtime";

interface Props {
  gameId: string;
  users: UserPayload[];
  name?: string;
  team: Team | null;
  onlineTeam: Team | null;
  teamNames: Teams;
  setTeam: Dispatch<SetStateAction<Team | null>>;
  setName: Dispatch<SetStateAction<string | undefined>>;
  onTeamNameChange: (params: { team: Team; name: string }) => void;
}

function OnlineLobby({
  gameId,
  users,
  name,
  onlineTeam,
  teamNames,
  setTeam,
  setName,
  onTeamNameChange,
}: Props) {
  const gameUrl = `http://localhost:3000/en-ligne/${gameId}`;
  const teamOneNameRef = useRef<HTMLInputElement>(null);
  const teamTwoNameRef = useRef<HTMLInputElement>(null);
  const { team1, team2 } = teamNames;

  if (name === undefined) return <EnterName onSubmitName={setName} />;
  return (
    <div>
      <h1>Équipes</h1>
      Joueurs présents :
      <ul>
        {users?.map(({ id, name, team }) => (team === undefined ? <li key={id}>{name}</li> : null))}
      </ul>
      {team1}
      <button onClick={() => setTeam(Team.team1)}>Rejoindre</button>
      <input disabled={onlineTeam !== Team.team1} ref={teamOneNameRef} />
      <button
        disabled={onlineTeam !== Team.team1}
        onClick={() =>
          onTeamNameChange({
            team: Team.team1,
            name: teamOneNameRef.current?.value || team1,
          })
        }
      >
        Changer le nom
      </button>
      <ul>
        {users?.map(({ id, name, team }) => (team === Team.team1 ? <li key={id}>{name}</li> : null))}
      </ul>
      {team2}
      <button onClick={() => setTeam(Team.team2)}>Rejoindre</button>
      <input disabled={onlineTeam !== Team.team2} ref={teamTwoNameRef} />
      <button
        disabled={onlineTeam !== Team.team2}
        onClick={() =>
          onTeamNameChange({
            team: Team.team2,
            name: teamTwoNameRef.current?.value || team2,
          })
        }
      >
        Changer le nom
      </button>
      <ul>
        {users?.map(({ id, name, team }) => (team === Team.team2 ? <li key={id}>{name}</li> : null))}
      </ul>
      <p>Copiez ce lien pour inviter vos amis dans la partie : {gameUrl}</p>
    </div>
  );
}

export default OnlineLobby;
