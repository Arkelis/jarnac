import { useBag } from "features/bag";
import { useCallback, useReducer } from "react";
import { opponent, Team } from "types";
import { useTeamTurn } from "./useTeamTurn";

interface Params {
  team1: string;
  team2: string;
}

type Board = string[][];

interface GameState {
  team1: { name: string; board: Board; letters: string[] };
  team2: { name: string; board: Board; letters: string[] };
}

export interface GameActions {
  init: (team: Team) => void;
  take: (team: Team) => void;
  swap: (team: Team, lettersToRemove: string[]) => void;
}

type Action =
  | { team: Team; type: "init"; letters: string[] } // take 6 letters from the bag
  | { team: Team; type: "take"; letter: string } // take a new letter from the bag
  | {
      team: Team;
      type: "swap";
      lettersToRemove: string[];
      newLetters: string[];
    } // swap three letters from the bag
  | { team: Team; type: "pass" } // pass
  | { team: Team; type: "jarnac"; lineIndex: number; word: string[] } // steal a word from the other team
  | { team: Team; type: "make"; lineIndex: number; word: string[] }; // make a new word

function gameReducer(gameState: GameState, action: Action) {
  switch (action.type) {
    case "init":
      gameState[action.team].letters = action.letters;
      return gameState;
    case "take":
      gameState[action.team].letters.push(action.letter);
      return gameState;
    case "swap": {
      const currentLetters = gameState[action.team].letters;
      action.lettersToRemove.forEach((letter) => {
        const idx = currentLetters.indexOf(letter);
        currentLetters.splice(idx, 1);
      });
      const newLetters = currentLetters.concat(...action.newLetters);
      gameState[action.team].letters = newLetters;
      return gameState;
    }
    case "pass":
      return gameState;
    case "jarnac":
      gameState[opponent(action.team)].board.splice(action.lineIndex, 1);
      // TODO: remove used letters from team letters
      gameState[action.team].board.push(action.word);
      return gameState;
    case "make":
      gameState[action.team].board[action.lineIndex] = action.word;
      // TODO: remove used letters from team letters
      return gameState;
  }
}

function initialGame({ team1, team2 }: Params): GameState {
  return {
    team1: { name: team1, board: [], letters: [] },
    team2: { name: team2, board: [], letters: [] },
  };
}

export function useGameActions({ team1, team2 }: Params) {
  const { draw, swapThree } = useBag();
  const { currentTeam, changeTurn } = useTeamTurn();
  const [gameState, dispatch] = useReducer(
    gameReducer,
    { team1, team2 },
    initialGame
  );

  const init = useCallback(
    (team: Team) => {
      const letters = Array(6).fill(undefined).map(draw);
      dispatch({ team, type: "init", letters });
    },
    [dispatch]
  );

  const take = useCallback(
    (team: Team) => {
      const letter = draw();
      dispatch({ team, type: "take", letter });
      changeTurn();
    },
    [dispatch, draw]
  );

  const swap = useCallback(
    (team: Team, lettersToRemove: string[]) => {
      const newLetters = swapThree(lettersToRemove);
      dispatch({ team, type: "swap", lettersToRemove, newLetters });
    },
    [dispatch]
  );

  return { gameState, currentTeam, init, take, swap };
}
