import { useFetchTeamNames, useUpdateTeamNames } from "db/queries";
import {
  UserPayload,
  useTeamsNamesChanges,
  useTeamsPresence,
} from "db/realtime";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { useMemo, useState } from "react";
import { Team } from "types";

interface Props {
  gameId: string;
}

function OnlineGame({ gameId }: Props) {
  // Players distribution amongst teams
  const [name, setName] = useState<string>();
  const [onlineTeam, setOnlineTeam] = useState<Team | null>(null); // team of local player
  const [users, setUsers] = useState<UserPayload[]>([]);
  useTeamsPresence({ gameId, setUsers, onlineTeam });

  // Team names and order definition
  const {
    data: teams,
    isLoading,
    isError,
    refetch,
  } = useFetchTeamNames({ gameId });
  const { updateFirstTeam, updateTeamLetter, updateTeamName } =
    useUpdateTeamNames({ teams, gameId });
  useTeamsNamesChanges({ gameId, refetchTeams: refetch });

  // Can the game continue?
  const gameIsOngoing = useMemo(() => {
    const teams = users.map((user) => user.team);
    return teams.includes(Team.team1) && teams.includes(Team.team2);
  }, [users]);

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur</p>;

  const teamNames = { team1: teams.team1.name, team2: teams.team2.name };
  const firstTeam = teams.firstTeam;

  return (
    <>
      <OnlineLobby
        gameId={gameId}
        users={users}
        name={name}
        team={onlineTeam}
        teamNames={teamNames}
        onlineTeam={onlineTeam}
        setTeam={setOnlineTeam}
        setName={setName}
        onTeamNameChange={updateTeamName}
      />
      {name === undefined ? null : firstTeam === undefined ? (
        <FirstPlayerDraw
          teams={teams}
          onlineTeam={onlineTeam}
          onAllPlayersSorted={updateFirstTeam}
          onSetLetter={updateTeamLetter}
        />
      ) : gameIsOngoing && firstTeam ? (
        <Game
          firstTeam={firstTeam}
          teamNames={{ team1: teamNames.team1, team2: teamNames.team2 }}
        />
      ) : (
        `Une équipe est vide`
      )}
    </>
  );
}

export default OnlineGame;
