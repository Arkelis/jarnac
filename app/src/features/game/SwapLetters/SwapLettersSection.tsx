import { ActionType } from "models/game"
import { useState } from "react"
import SwapLetters from "./SwapLetters"

interface Props {
  letters: string[]
  onConfirmSwap: (letters: string[]) => void
  possibleActions: ActionType[]
  isInitiated: boolean
}

function SwapLettersSection({ letters, onConfirmSwap, possibleActions, isInitiated }: Props) {
  const [isSwappingLetters, setIsSwappingLetters] = useState(false)

  return (
    <>
      {possibleActions.includes("take") && isInitiated && (
        <button onClick={() => setIsSwappingLetters(true)}>Echanger trois lettres</button>
      )}
      {isSwappingLetters && (
        <SwapLetters
          letters={letters}
          onConfirm={(letters) => {
            setIsSwappingLetters(false)
            onConfirmSwap(letters)
          }}
          onCancel={() => {
            setIsSwappingLetters(false)
          }}
        />
      )}
    </>
  )
}

export default SwapLettersSection
