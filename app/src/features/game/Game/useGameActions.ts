import { useFetchGame, useUpdateGame } from "db/queries/game"
import { useBag } from "features/useBag"
import { Action, GameState, initialGame, isConsonant, PendingWord } from "models/game"
import { useCallback, useEffect, useReducer } from "react"
import { opponent, Team } from "types"

function gameReducer(currentGameState: GameState, action: Action) {
  const gameState = structuredClone(currentGameState) as GameState
  const currentTeam = gameState.currentTeam
  const opponentTeam = opponent(currentTeam)

  switch (action.type) {
    case "sync":
      return action.newGameState

    case "changeTurn":
      gameState.currentTeam = opponentTeam
      return gameState

    case "init":
      gameState[currentTeam].letters = action.letters
      gameState[currentTeam].possibleActions = ["pass", "proposeWord"]
      return gameState

    case "take":
      gameState[currentTeam].letters.push(action.letter)
      gameState[currentTeam].possibleActions = ["pass", "proposeWord"]
      return gameState

    case "swap": {
      const currentLetters = gameState[currentTeam].letters
      action.lettersToRemove.forEach((letter) => {
        const idx = currentLetters.indexOf(letter)
        currentLetters.splice(idx, 1)
      })
      gameState[currentTeam].letters = [...currentLetters, ...action.newLetters]
      gameState[currentTeam].possibleActions = ["proposeWord", "pass"]
      return gameState
    }

    case "pass":
      gameState[opponentTeam].possibleActions = ["jarnac", "take", "swap"]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState

    case "jarnacTimeout":
      gameState[currentTeam].possibleActions = ["take", "swap"]
      return gameState

    case "jarnac":
      return gameState

    case "proposeWord":
      gameState.pendingWord = action.wordProposition
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = ["approveWord", "refuseWord"]
      gameState.currentTeam = opponentTeam
      return gameState

    case "proposeJarnac":
      gameState.pendingWord = action.wordProposition
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = ["approveJarnac", "refuseJarnac"]
      gameState.currentTeam = opponentTeam
      return gameState

    case "refuseWord":
      gameState.pendingWord = null
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = ["pass", "proposeWord"]
      gameState.currentTeam = opponentTeam
      return gameState

    case "refuseJarnac":
      gameState.pendingWord = null
      gameState[currentTeam].possibleActions = []
      gameState[opponentTeam].possibleActions = ["take", "swap"]
      gameState.currentTeam = opponentTeam
      return gameState

    case "approveJarnac": {
      if (!gameState.pendingWord) return gameState
      const { word, lineIndex, otherLetters } = gameState.pendingWord
      gameState.pendingWord = null
      gameState[currentTeam].board.splice(lineIndex, 1)
      gameState[currentTeam].letters = otherLetters
      gameState[opponentTeam].board.push(word)
      gameState[opponentTeam].possibleActions = ["take"]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState
    }

    case "approveWord": {
      if (!gameState.pendingWord) return gameState
      const { word, lineIndex, otherLetters } = gameState.pendingWord
      gameState.pendingWord = null
      gameState[opponentTeam].board[lineIndex] = word
      gameState[opponentTeam].letters = otherLetters
      gameState[opponentTeam].possibleActions = ["take"]
      gameState[currentTeam].possibleActions = []
      gameState.currentTeam = opponentTeam
      return gameState
    }
  }
}

interface Params {
  firstTeam: Team
  gameId?: string
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

export function useGameActions({ firstTeam, gameId }: Params): { gameState: GameState } & GameActions {
  const { bag, draw, discard, swapThree } = useBag(gameId)
  const [gameState, _dispatch] = useReducer(gameReducer, { firstTeam }, initialGame)

  // online synchronization
  const { mutate } = useUpdateGame({ gameId })
  const dispatch = useCallback(
    (action: Action) => {
      _dispatch(action)
      mutate(gameReducer(gameState, action))
    },
    [mutate, gameState]
  )
  useFetchGame({
    gameId,
    onSuccess: (newGameState) => _dispatch({ type: "sync", newGameState }),
  })

  const init = useCallback(() => {
    const letters = Array(6).fill(undefined).map(draw)
    while (letters.every((letter) => isConsonant(letter))) {
      discard(letters.pop())
      letters.push(draw())
    }
    dispatch({ type: "init", letters })
  }, [])

  useEffect(() => {
    if (
      !gameState.team1.possibleActions.includes("jarnac") &&
      !gameState.team2.possibleActions.includes("jarnac")
    ) {
      return
    }
    const timer = setTimeout(() => dispatch({ type: "jarnacTimeout" }), 1000)
    return () => clearTimeout(timer)
  }, [gameState])

  const take = useCallback(() => {
    if (bag.length < 1) {
      return "error"
    }
    const letter = draw()
    dispatch({ type: "take", letter })
    return "ok"
  }, [draw])

  const swap = useCallback((lettersToRemove: string[]) => {
    if (bag.length < 3) {
      return "error"
    }
    const newLetters = swapThree(lettersToRemove)
    dispatch({ type: "swap", lettersToRemove, newLetters })
    return "ok"
  }, [])

  const pass = useCallback(() => dispatch({ type: "pass" }), [])
  const proposeWord = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: "proposeWord", wordProposition }),
    []
  )
  const proposeJarnac = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: "proposeJarnac", wordProposition }),
    []
  )
  const approveWord = useCallback(() => dispatch({ type: "approveWord" }), [])
  const refuseWord = useCallback(() => dispatch({ type: "refuseWord" }), [])
  const approveJarnac = useCallback(() => dispatch({ type: "approveJarnac" }), [])
  const refuseJarnac = useCallback(() => dispatch({ type: "refuseJarnac" }), [])

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
