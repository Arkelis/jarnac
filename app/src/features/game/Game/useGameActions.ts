import { useFetchGame, useUpdateGame } from "db/queries/game"
import { useBag } from "features/useBag"
import { Bag } from "models/bag"
import { Action, GameState, initialGame, isConsonant, PendingWord } from "models/game"
import { useCallback, useEffect, useReducer } from "react"
import { opponent, Team } from "types"

function gameReducer(currentGameState: GameState, action: Action) {
  const gameState = structuredClone(currentGameState) as GameState
  const currentTeam = gameState.currentTeam
  const opponentTeam = opponent(currentTeam)

  switch (action.type) {
    case "sync":
      return action.gameState

    case "changeTurn":
      gameState.currentTeam = opponentTeam
      return gameState

    case "init":
      gameState[currentTeam].letters = action.letters
      gameState[currentTeam].initiated = true
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
  const { bag, draw, drawSix, discard, swapThree } = useBag(gameId)
  const [gameState, _dispatch] = useReducer(gameReducer, { firstTeam }, initialGame)

  // online synchronization
  const { mutate } = useUpdateGame({ gameId })
  const dispatch = useCallback(
    (action: Action, newBag?: Bag) => {
      _dispatch(action)
      mutate({ gameState: gameReducer(gameState, action), bag: newBag })
    },
    [mutate, gameState]
  )
  useFetchGame({
    gameId,
    onSuccess: ({ gameState }) => _dispatch({ type: "sync", gameState }),
  })

  const init = useCallback(() => {
    const { newBag, newLetters } = drawSix()
    while (newLetters.every((letter) => isConsonant(letter))) {
      const letterToRemove = newLetters.pop() as string
      discard(letterToRemove)
      newBag.push(letterToRemove)

      const { letter } = draw()
      newBag.splice(newBag.indexOf(letter), 1)
      newLetters.push(letter)
    }
    dispatch({ type: "init", letters: newLetters }, newBag)
  }, [discard, dispatch, draw, drawSix])

  useEffect(() => {
    if (
      !gameState.team1.possibleActions.includes("jarnac") &&
      !gameState.team2.possibleActions.includes("jarnac")
    ) {
      return
    }
    const timer = setTimeout(() => dispatch({ type: "jarnacTimeout" }), 2000)
    return () => clearTimeout(timer)
  }, [dispatch, gameState])

  const take = useCallback(() => {
    if (bag.length < 1) {
      return "error"
    }
    const { newBag, letter } = draw()
    dispatch({ type: "take", letter }, newBag)
    return "ok"
  }, [bag.length, dispatch, draw])

  const swap = useCallback(
    (lettersToRemove: string[]) => {
      if (bag.length < 3) {
        return "error"
      }
      const { newBag, newLetters } = swapThree(lettersToRemove)
      dispatch({ type: "swap", lettersToRemove, newLetters }, newBag)
      return "ok"
    },
    [bag.length, dispatch, swapThree]
  )

  const pass = useCallback(() => dispatch({ type: "pass" }), [dispatch])
  const proposeWord = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: "proposeWord", wordProposition }),
    [dispatch]
  )
  const proposeJarnac = useCallback(
    (wordProposition: PendingWord) => dispatch({ type: "proposeJarnac", wordProposition }),
    [dispatch]
  )
  const approveWord = useCallback(() => dispatch({ type: "approveWord" }), [dispatch])
  const refuseWord = useCallback(() => dispatch({ type: "refuseWord" }), [dispatch])
  const approveJarnac = useCallback(() => dispatch({ type: "approveJarnac" }), [dispatch])
  const refuseJarnac = useCallback(() => dispatch({ type: "refuseJarnac" }), [dispatch])

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
