import { useState } from "react"
import SwapLetters from "./SwapLetters"

interface Props {
  canPlay: boolean
  letters: string[]
  onConfirmSwap: (letters: string[]) => void
}

function SwapLettersSection({ canPlay, letters, onConfirmSwap }: Props) {
  const [isSwappingLetters, setIsSwappingLetters] = useState(false)

  return (
    <>
      {canPlay && <button onClick={() => setIsSwappingLetters(true)}>Echanger trois lettres</button>}
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
