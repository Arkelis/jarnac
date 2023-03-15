import EnterName from "./EnterName";
import { Team, Teams } from "types";
import { UserPayload } from "features/OnlineGame/OnlineGame";
import { Dispatch, SetStateAction, useRef } from "react";
import { useUpdateTeamNames } from "db/queries";

interface Props {
  gameId: string;
  users: UserPayload[];
  name?: string;
  team: Team | null;
  onlineTeam: Team | null;
  teamNames: Teams;
  setTeam: Dispatch<SetStateAction<Team | null>>;
  setName: Dispatch<SetStateAction<string | undefined>>;
}

function OnlineLobby({
  gameId,
  users,
  name,
  onlineTeam,
  teamNames,
  setTeam,
  setName,
}: Props) {
  const gameUrl = `http://localhost:3000/en-ligne/${gameId}`;
  const teamOneNameRef = useRef<HTMLInputElement>(null);
  const teamTwoNameRef = useRef<HTMLInputElement>(null);
  const { mutate } = useUpdateTeamNames({ id: gameId });

  if (name === undefined) return <EnterName onSubmitName={setName} />;
  return (
    <div>
      <h1>Équipes</h1>
      Joueurs présents :
      <ul>
        {users?.map(({ id, name, team }) =>
          team === undefined ? <li key={id}>{name}</li> : null
        )}
      </ul>
      {teamNames.team1}
      <button onClick={() => setTeam(Team.team1)}>Rejoindre</button>
      <input disabled={onlineTeam !== Team.team1} ref={teamOneNameRef} />
      <button
        disabled={onlineTeam !== Team.team1}
        onClick={() => {
          const newTeams = {
            ...teamNames,
            team1: teamOneNameRef.current?.value || teamNames.team1,
          };
          mutate(newTeams);
        }}
      >
        Changer le nom
      </button>
      <ul>
        {users?.map(({ id, name, team }) =>
          team === Team.team1 ? <li key={id}>{name}</li> : null
        )}
      </ul>
      {teamNames.team2}
      <button onClick={() => setTeam(Team.team2)}>Rejoindre</button>
      <input disabled={onlineTeam !== Team.team2} ref={teamTwoNameRef} />
      <button
        disabled={onlineTeam !== Team.team2}
        onClick={() => {
          const newTeams = {
            ...teamNames,
            team2: teamTwoNameRef.current?.value || teamNames.team2,
          };
          mutate(newTeams);
        }}
      >
        Changer le nom
      </button>
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
