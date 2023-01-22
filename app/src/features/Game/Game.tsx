import { useState } from "react";
import { Teams } from "../../types";

interface Props {
  teams: Teams;
}

function Game({ teams }: Props) {
  const gameState = useState({ team1: teams.team1, letters: [] });
  return <pre>{JSON.stringify(teams)}</pre>;
}

export default Game;
