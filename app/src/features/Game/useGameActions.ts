import { useBag } from "features/bag";
import { useCallback, useReducer } from "react";

interface Params {
  team1: string;
  team2: string;
}

type Board = string[][];
type TeamOneOrTwo = "team1" | "team2";

interface GameState {
  team1: { name: string; board: Board; letters: string[] };
  team2: { name: string; board: Board; letters: string[] };
}

type Action =
  | { team: TeamOneOrTwo; type: "init"; letters: string[] } // take 6 letters from the bag
  | { team: TeamOneOrTwo; type: "take"; letter: string } // take a new letter from the bag
  | {
      team: TeamOneOrTwo;
      type: "swap";
      lettersToRemove: string[];
      newLetters: string[];
    } // swap three letters from the bag
  | { team: TeamOneOrTwo; type: "pass" } // pass
  | { team: TeamOneOrTwo; type: "jarnac"; lineIndex: number; word: string[] } // steal a word from the other team
  | { team: TeamOneOrTwo; type: "make"; lineIndex: number; word: string[] }; // make a new word

function opponent(t: TeamOneOrTwo): TeamOneOrTwo {
  return t == "team1" ? "team2" : "team1";
}

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
  const { bag, draw, swapThree } = useBag();
  const [teamsState, dispatch] = useReducer(
    gameReducer,
    { team1, team2 },
    initialGame
  );
  const init = useCallback(
    (team: TeamOneOrTwo) => {
      const letters = Array(6).map(draw);
      dispatch({ team, type: "init", letters });
    },
    [dispatch]
  );
  const take = useCallback(
    (team: TeamOneOrTwo) => {
      const letter = draw();
      dispatch({ team, type: "take", letter });
    },
    [dispatch, draw]
  );
  const swap = useCallback(
    (team: TeamOneOrTwo, lettersToRemove: string[]) => {
      const newLetters = swapThree(lettersToRemove);
      dispatch({ team, type: "swap", lettersToRemove, newLetters });
    },
    [dispatch]
  );

  return { state: teamsState, init, take, swap };
}
