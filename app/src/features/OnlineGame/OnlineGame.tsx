import { useFetchTeamNames } from "db/queries";
import { teamsNamesChanges, teamsPresenceState } from "db/realtime";
import FirstPlayerDraw from "features/FirstPlayerDraw/FirstPlayerDraw";
import Game from "features/game/Game/Game";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { isError } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Team, Teams } from "types";
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
    data: teamNames,
    isLoading,
    isError,
    refetch,
  } = useFetchTeamNames({ id });
  const [onlineTeam, setOnlineTeam] = useState<Team | null>(null); // team of local player
  const [firstTeam, setFirstTeam] = useState<Team>();
  const [name, setName] = useState<string>();
  const [users, setUsers] = useState<UserPayload[]>([]);
  const userId = useMemo(() => uuid.v4(), []);
  const gameIsOngoing = useMemo(() => {
    const teams = users.map((user) => user.team);
    return teams.includes(Team.team1) && teams.includes(Team.team2);
  }, [users]);

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
      />
      {name === undefined ? null : firstTeam === undefined ? (
        <FirstPlayerDraw
          teamNames={teamNames}
          onlineTeam={onlineTeam}
          onAllPlayersSorted={setFirstTeam}
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
