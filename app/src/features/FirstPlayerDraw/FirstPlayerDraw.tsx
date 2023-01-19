import { useState } from "react";
import { useBag } from "../bag";
import CreateTeam from "./CreateTeam";

interface Props {
  onAllPlayersSorted: (sortedPlayers: string[]) => void;
}

type TeamsState = Record<"letter" | "name", string | undefined>[];

function teamIndexWithoutLetter(teams: TeamsState) {
  if (teams.length < 2) return teams.length
  return teams
    .map(({ name: _, letter }, idx) => ({ letter, idx }))
    .filter(({ letter }) => letter === undefined)
    .at(0)?.idx;
}

function FirstPlayerDraw({ onAllPlayersSorted }: Props) {
  const { bag, draw } = useBag();
  const [teams, setTeams] = useState<TeamsState>([]);
  const teamIndex = teamIndexWithoutLetter(teams);

  if (teamIndex !== undefined) {
    return (
      <CreateTeam
        key={teamIndex}
        anonymizedName={`Equipe ${teamIndex + 1}`}
        defaultName={teams.at(teamIndex)?.name}
        draw={draw}
        onCreated={(name: string, letter: string) => {
          teams[teamIndex] = { name, letter };
          setTeams([...teams]);
        }}
      />
    );
  }

  if (teams.at(0)?.letter === teams.at(1)?.letter) {
    setTeams([
      { name: teams.at(0)?.name, letter: undefined },
      { name: teams.at(1)?.name, letter: undefined },
    ]);
    return null;
  }

  return (
    <>
      <ul>
        {teams.map(({ name, letter }) => (
          <li
            key={`${name}${letter}`}
          >{`Equipe ${name}. Lettre : ${letter}`}</li>
        ))}
      </ul>
      <p>
        Ordre de passage:
        <pre>
          {JSON.stringify(
            teams
              .sort((a, b) =>
                (a.letter as string).localeCompare(b.letter as string)
              )
              .map((t) => t.name)
          )}
        </pre>
      </p>
    </>
  );
}

export default FirstPlayerDraw;
