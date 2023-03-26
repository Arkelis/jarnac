import { Team } from "types"

type Board = string[][]

export type Action =
  | { type: "proposeWord"; wordProposition: PendingWord }
  | { type: "proposeJarnac"; wordProposition: PendingWord }
  | { type: "refuseWord" }
  | { type: "refuseJarnac" }
  | { type: "changeTurn" }
  | { type: "approveWord" }
  | { type: "approveJarnac" }
  | { type: "init"; letters: string[] } // take 6 letters from the bag
  | { type: "take"; letter: string } // take a new letter from the bag
  | {
      type: "swap"
      lettersToRemove: string[]
      newLetters: string[]
    } // swap three letters from the bag
  | { type: "pass" } // pass
  | { type: "jarnacTimeout" } // cannot jarnac anymore after 1 sec
  | { type: "jarnac"; lineIndex: number; word: string[] } // steal a word from the other team

export type ActionType = Action["type"]

export interface PendingWord {
  word: string[]
  lineIndex: number
  otherLetters: string[]
}

interface TeamState {
  possibleActions: ActionType[]
  board: Board
  letters: string[]
}

export interface GameState {
  currentTeam: Team
  pendingWord: PendingWord | null
  team1: TeamState
  team2: TeamState
}

export function isConsonant(letter: string) {
  return !["A", "E", "I", "O", "U", "Y"].includes(letter.toUpperCase())
}

interface InitialGameParams {
  firstTeam: Team
}

export function initialGame({ firstTeam }: InitialGameParams): GameState {
  return {
    pendingWord: null,
    currentTeam: firstTeam,
    team1: {
      possibleActions: firstTeam === Team.team1 ? ["take"] : [],
      board: [],
      letters: [],
    },
    team2: {
      possibleActions: firstTeam === Team.team2 ? ["take"] : [],
      board: [],
      letters: [],
    },
  }
}
