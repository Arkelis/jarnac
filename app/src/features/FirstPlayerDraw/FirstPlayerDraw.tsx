import { useState } from "react";
import { useBag } from "../bag";
import CreateTeam from "./CreateTeam";

interface Props {
  onAllPlayersSorted: (sortedPlayers: { team1: string; team2: string }) => void;
}

interface TeamsState {
  team1: { name?: string; letter?: string };
  team2: { name?: string; letter?: string };
}

function FirstPlayerDraw({ onAllPlayersSorted }: Props) {
  const { bag, draw } = useBag();
  const [teams, setTeams] = useState<TeamsState>({
    team1: {},
    team2: {},
  });

  if (teams.team1.letter === undefined) {
    return (
      <CreateTeam
        key={1}
        anonymizedName="Équipe 1"
        defaultName={teams.team1.name}
        draw={draw}
        onCreated={(name: string, letter: string) => {
          setTeams({ ...teams, team1: { name, letter } });
        }}
      />
    );
  }

  if (teams.team2.letter === undefined) {
    return (
      <CreateTeam
        key={2}
        anonymizedName="Équipe 2"
        defaultName={teams.team2.name}
        draw={draw}
        onCreated={(name: string, letter: string) => {
          setTeams({ ...teams, team2: { name, letter } });
        }}
      />
    );
  }

  if (teams.team1.letter === teams.team2.letter) {
    setTeams({
      team1: { name: teams.team1.name, letter: undefined },
      team2: { name: teams.team2.name, letter: undefined },
    });
    return null;
  }

  const sortedTeams = Object.values(teams)
    .sort((a, b) => (a.letter as string).localeCompare(b.letter as string))
    .map((t) => t.name as string);

  return (
    <>
      <ul>
        {Object.values(teams).map(({ name, letter }) => (
          <li
            key={`${name}${letter}`}
          >{`Équipe ${name}. Lettre : ${letter}`}</li>
        ))}
      </ul>
      <p>
        Ordre de passage:
        <p>{sortedTeams.join(", ")}</p>
      </p>
      <button
        onClick={() =>
          onAllPlayersSorted({ team1: sortedTeams[0], team2: sortedTeams[1] })
        }
      >
        Commencer !
      </button>
    </>
  );
}

export default FirstPlayerDraw;
