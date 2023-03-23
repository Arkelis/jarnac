import { useCallback, useState } from "react"

interface Props {
  letters: string[]
  onCancel: () => void
  onConfirm: (letters: string[]) => void
}

function SwapLetters({ letters, onConfirm, onCancel }: Props) {
  const [lettersToSwap, setLettersToSwap] = useState<string[]>([])
  const [lettersToKeep, setLettersToKeep] = useState(letters)
  const cannotSelectOtherLetters = lettersToSwap.length === 3
  const cannotApproveSwap = lettersToSwap.length < 3

  const change = useCallback(
    (letter: string, idx: number) => () => {
      setLettersToSwap((ls) => [...ls, letter])
      setLettersToKeep((ls) => {
        const newLetters = [...ls]
        newLetters.splice(idx, 1)
        return newLetters
      })
    },
    []
  )

  const keep = useCallback(
    (letter: string, idx: number) => () => {
      setLettersToSwap((ls) => {
        const newLetters = [...ls]
        newLetters.splice(idx, 1)
        return newLetters
      })
      setLettersToKeep((ls) => [...ls, letter])
    },
    []
  )

  return (
    <div>
      <label>Choisissez vos lettres à changer</label>
      <p>
        {lettersToSwap.map((letter, idx) => (
          <button key={`${letter}${idx}`} onClick={keep(letter, idx)}>
            {letter}
          </button>
        ))}
      </p>
      <label>Votre réserve de lettres</label>
      <p>
        {lettersToKeep.map((letter, idx) => (
          <button
            disabled={cannotSelectOtherLetters}
            key={`${letter}${idx}`}
            onClick={change(letter, idx)}
          >
            {letter}
          </button>
        ))}
      </p>
      <button disabled={cannotApproveSwap} onClick={() => onConfirm(lettersToSwap)}>
        Valider
      </button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  )
}

export default SwapLetters
