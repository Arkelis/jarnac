import { useBag } from "features/bag"
import { useCallback, useEffect, useReducer } from "react"
import { opponent, Team } from "types"

type Board = string[][]

export enum ActionType {
  proposeWord = "proposeWord",
  refuseWord = "refuseWord",
  changeTurn = "changeTurn",
  approveWord = "approveWord",
  init = "init",
  take = "take",
  swap = "swap",
  pass = "pass",
  jarnac = "jarnac",
  jarnacTimeout = "jarnacTimeout",
  proposeJarnac = "proposeJarnac",
  approveJarnac = "approveJarnac",
  refuseJarnac = "refuseJarnac",
}

type Action =
  | { type: ActionType.proposeWord; wordProposition: PendingWord }
  | { type: ActionType.proposeJarnac; wordProposition: PendingWord }
  | { type: ActionType.refuseWord }
  | { type: ActionType.refuseJarnac }
  | { type: ActionType.changeTurn }
  | { type: ActionType.approveWord }
  | { type: ActionType.approveJarnac }
  | { type: ActionType.init; letters: string[] } // take 6 letters from the bag
  | { type: ActionType.take; letter: string } // take a new letter from the bag
  | {
      type: ActionType.swap
      lettersToRemove: string[]
      newLetters: string[]
    } // swap three letters from the bag
  | { type: ActionType.pass } // pass
  | { type: ActionType.jarnacTimeout } // cannot jarnac anymore after 1 sec
  | { type: ActionType.jarnac; lineIndex: number; word: string[] } // steal a word from the other team

export interface PendingWord {
  word: string[]
  lineIndex: number
  otherLetters: string[]
}

interface TeamState {
  possibleActions: ActionType[]
  name: string
  board: Board
  letters: string[]
}

export interface GameState {
  currentTeam: Team
  pendingWord: PendingWord | null
  team1: TeamState
  team2: TeamState
}

function isConsonant(letter: string) {
  return !["A", "E", "I", "O", "U", "Y"].includes(letter.toUpperCase())
}

function gameReducer(currentGameState: GameState, action: Action) {
  const gameState = structuredClone(currentGameState) as GameState
  const currentTeam = gameState.currentTeam
  const opponentTeam = opponent(currentTeam)

  switch (action.type) {
    case ActionType.changeTurn:
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.init:
      gameState[currentTeam].letters = action.letters
      gameState[currentTeam].possibleActions = [ActionType.pass, ActionType.proposeWord]
      return gameState

    case ActionType.take:
      gameState[currentTeam].letters.push(action.letter)
      gameState[currentTeam].possibleActions = [ActionType.pass, ActionType.proposeWord]
      return gameState

    case ActionType.swap: {
      const currentLetters = gameState[currentTeam].letters
      action.lettersToRemove.forEach((letter) => {
        const idx = currentLetters.indexOf(letter)
        currentLetters.splice(idx, 1)
      })
      gameState[currentTeam].letters = [...currentLetters, ...action.newLetters]
      gameState[currentTeam].possibleActions = [ActionType.proposeWord, ActionType.pass]
      return gameState
    }

    case ActionType.pass:
      gameState[opponentTeam].possibleActions = [ActionType.jarnac, ActionType.take, ActionType.swap]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.jarnacTimeout:
      gameState[currentTeam].possibleActions = [ActionType.take, ActionType.swap]
      return gameState

    case ActionType.jarnac:
      return gameState

    case ActionType.proposeWord:
      gameState.pendingWord = action.wordProposition
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = [ActionType.approveWord, ActionType.refuseWord]
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.proposeJarnac:
      gameState.pendingWord = action.wordProposition
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = [ActionType.approveJarnac, ActionType.refuseJarnac]
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.refuseWord:
      gameState.pendingWord = null
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = [ActionType.pass, ActionType.proposeWord]
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.refuseJarnac:
      gameState.pendingWord = null
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = [ActionType.take, ActionType.swap]
      gameState.currentTeam = opponentTeam
      return gameState

    case ActionType.approveJarnac: {
      if (!gameState.pendingWord) return gameState
      const { word, lineIndex, otherLetters } = gameState.pendingWord
      gameState.pendingWord = null
      gameState[currentTeam].board.splice(lineIndex, 1)
      gameState[currentTeam].letters = otherLetters
      gameState[opponentTeam].board.push(word)
      gameState[opponentTeam].possibleActions = [ActionType.take]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState
    }

    case ActionType.approveWord: {
      if (!gameState.pendingWord) return gameState
      const { word, lineIndex, otherLetters } = gameState.pendingWord
      gameState.pendingWord = null
      gameState[opponentTeam].board[lineIndex] = word
      gameState[opponentTeam].letters = otherLetters
      gameState[opponentTeam].possibleActions = [ActionType.take]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState
    }
  }
}

interface Params {
  team1: string
  team2: string
  firstTeam: Team
  online: boolean
}

function initialGame({ team1, team2, firstTeam }: Params): GameState {
  return {
    pendingWord: null,
    currentTeam: firstTeam,
    team1: {
      possibleActions: firstTeam === Team.team1 ? [ActionType.take] : [],
      name: team1,
      board: [],
      letters: [],
    },
    team2: {
      possibleActions: firstTeam === Team.team2 ? [ActionType.take] : [],
      name: team2,
      board: [],
      letters: [],
    },
  }
}

export interface GameActions {
  init: () => void
  take: () => void
  swap: (lettersToRemove: string[]) => void
  proposeWord: (wordPropostion: PendingWord) => void
  approveWord: () => void
  refuseWord: () => void
  pass: () => void
  proposeJarnac: (wordProposition: PendingWord) => void
  approveJarnac: () => void
  refuseJarnac: () => void
}

export function useGameActions({
  team1,
  team2,
  firstTeam,
  online = false,
}: Params): { gameState: GameState } & GameActions {
  const { bag, draw, discard, swapThree } = useBag({ online })
  const [gameState, dispatch] = useReducer(gameReducer, { team1, team2, firstTeam, online }, initialGame)

  const init = useCallback(() => {
    const letters = Array(6).fill(undefined).map(draw)
    while (letters.every((letter) => isConsonant(letter))) {
      discard(letters.pop())
      letters.push(draw())
    }
    dispatch({ type: ActionType.init, letters })
  }, [])

  useEffect(() => {
    if (
      !gameState.team1.possibleActions.includes(ActionType.jarnac) &&
      !gameState.team2.possibleActions.includes(ActionType.jarnac)
    ) {
      return
    }
    const timer = setTimeout(() => dispatch({ type: ActionType.jarnacTimeout }), 1000)
    return () => clearTimeout(timer)
  }, [gameState])

  const take = useCallback(() => {
    if (bag.length < 1) {
      return "error"
    }
    const letter = draw()
    dispatch({ type: ActionType.take, letter })
    return "ok"
  }, [draw])

  const swap = useCallback((lettersToRemove: string[]) => {
    if (bag.length < 3) {
      return "error"
    }
    const newLetters = swapThree(lettersToRemove)
    dispatch({ type: ActionType.swap, lettersToRemove, newLetters })
    return "ok"
  }, [])

  const pass = useCallback(() => dispatch({ type: ActionType.pass }), [])
  const proposeWord = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: ActionType.proposeWord, wordProposition }),
    []
  )
  const proposeJarnac = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: ActionType.proposeJarnac, wordProposition }),
    []
  )
  const approveWord = useCallback(() => dispatch({ type: ActionType.approveWord }), [])
  const refuseWord = useCallback(() => dispatch({ type: ActionType.refuseWord }), [])
  const approveJarnac = useCallback(() => dispatch({ type: ActionType.approveJarnac }), [])
  const refuseJarnac = useCallback(() => dispatch({ type: ActionType.refuseJarnac }), [])

  return {
    gameState,
    init,
    take,
    swap,
    pass,
    proposeWord,
    approveWord,
    refuseWord,
    proposeJarnac,
    approveJarnac,
    refuseJarnac,
  }
}
