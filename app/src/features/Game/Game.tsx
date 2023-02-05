import Set from "features/Set/Set";
import { useState } from "react";
import { Team, Teams } from "types";
import { useGameActions } from "./useGameActions";

interface Props {
  teamNames: Teams;
}

function Game({ teamNames }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames;
  const { gameState, ...actions } = useGameActions({
    team1: teamOneName,
    team2: teamTwoName,
  });

  return (
    <>
      <div>
        <Set team={Team.team1} gameState={gameState} {...actions} />
        <Set team={Team.team2} gameState={gameState} {...actions} />
      </div>
    </>
  );
}

export default Game;
