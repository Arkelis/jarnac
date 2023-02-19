import { useState } from "react";
import { useBag } from "features/bag";
import CreateTeam from "./CreateTeam";
import { Team } from "types";

interface Props {
  onAllPlayersSorted: (sortedPlayers: {
    team1: string;
    team2: string;
    firstTeam: Team;
  }) => void;
  onlineTeam?: Team | null;
}

interface TeamsState {
  team1: { name?: string; letter?: string };
  team2: { name?: string; letter?: string };
}

const canClick = (team: Team, onlineTeam?: Team | null) => {
  if (onlineTeam === undefined) return true;
  if (onlineTeam === null) return false;
  return team === onlineTeam;
};

function FirstPlayerDraw({ onAllPlayersSorted, onlineTeam }: Props) {
  const { draw } = useBag();
  const [teams, setTeams] = useState<TeamsState>({
    team1: {},
    team2: {},
  });

  const updateTeams = (team: Team) => (name: string, letter: string) => {
    const newState = { ...teams, [team]: { name, letter } };
    if (newState.team1.letter === newState.team2.letter)
      return setTeams({
        team1: { name: newState.team1.name, letter: undefined },
        team2: { name: newState.team2.name, letter: undefined },
      });
    setTeams(newState);
  };

  const sortedTeams =
    teams.team1.letter &&
    teams.team2.letter &&
    Object.entries(teams).sort(([, t1], [, t2]) =>
      (t1.letter as string).localeCompare(t2.letter as string)
    );

  return (
    <>
      <CreateTeam
        key={1}
        defaultName="Charme"
        definedName={teams.team1.name}
        draw={draw}
        onCreated={updateTeams(Team.team1)}
        interactionsEnabled={canClick(Team.team1, onlineTeam)}
      />
      <CreateTeam
        key={2}
        defaultName="Ébène"
        definedName={teams.team2.name}
        draw={draw}
        onCreated={updateTeams(Team.team2)}
        interactionsEnabled={canClick(Team.team2, onlineTeam)}
      />
      {sortedTeams && (
        <>
          <p>
            Ordre de passage:{" "}
            {sortedTeams.map((t) => t[1].name as string).join(", ")}
          </p>
          <button
            onClick={() =>
              onAllPlayersSorted({
                team1: teams.team1.name as string,
                team2: teams.team2.name as string,
                firstTeam: sortedTeams[0][0] as Team,
              })
            }
          >
            Commencer !
          </button>
        </>
      )}
    </>
  );
}

export default FirstPlayerDraw;
