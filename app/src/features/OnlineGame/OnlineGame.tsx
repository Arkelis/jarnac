import { useFetchTeamNames, useUpdateTeamNames } from "db/queries";
import { teamsNamesChanges, teamsPresenceState } from "db/realtime";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Team } from "types";
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
  const {
    data: teams,
    isLoading,
    isError,
    refetch,
  } = useFetchTeamNames({ id });
  const { mutate: updateTeams } = useUpdateTeamNames({ id });
  const [onlineTeam, setOnlineTeam] = useState<Team | null>(null); // team of local player
  const [name, setName] = useState<string>();
  const [users, setUsers] = useState<UserPayload[]>([]);
  const userId = useMemo(() => uuid.v4(), []);
  const gameIsOngoing = useMemo(() => {
    const teams = users.map((user) => user.team);
    return teams.includes(Team.team1) && teams.includes(Team.team2);
  }, [users]);

  const updateTeamLetter = useCallback(
    (team: Team) => (letter: string) => {
      if (!teams) return;
      updateTeams({ ...teams, [team]: { ...teams[team], letter } });
    },
    [teams, updateTeams]
  );

  const updateTeamName = useCallback(
    ({ team, name }: { team: Team; name: string }) => {
      if (!teams) return;
      updateTeams({ ...teams, [team]: { ...teams[team], name } });
    },
    [teams]
  );

  const updateFirstTeam = useCallback(
    (team: Team) => {
      if (!teams) return;
      updateTeams({ ...teams, firstTeam: team });
    },
    [teams]
  );

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

  useEffect(() => {
    teamsNamesChanges({ gameId: id })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${id}`,
        },
        () => refetch()
      )
      .subscribe();
    return () => {
      teamsNamesChanges({ gameId: id }).unsubscribe();
    };
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur</p>;

  const teamNames = { team1: teams.team1.name, team2: teams.team2.name };
  const firstTeam = teams.firstTeam;

  return (
    <>
      <OnlineLobby
        gameId={id}
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
