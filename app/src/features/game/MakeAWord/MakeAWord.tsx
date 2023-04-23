import Letter from "components/Letter"
import { countBy } from "lodash"
import { useCallback, useMemo, useState } from "react"

interface Props {
  letters: string[]
  line: string[]
  onConfirm: (word: string[], otherLetters: string[]) => void
  onCancel: () => void
}

function MakeAWord({ letters, line, onConfirm, onCancel }: Props) {
  const [word, setWord] = useState(line)
  const [otherLetters, setOtherLetters] = useState(letters)

  const canConfirm = useMemo(() => {
    if (word.length < 3) return false
    if (word.length > 9) return false
    if (word.length <= line.length) return false
    const wordCounter = countBy(word)
    const lineCounter = countBy(line)
    for (const letter in lineCounter) {
      if (lineCounter[letter] > (wordCounter[letter] || 0)) return false
    }
    return true
  }, [word, line])

  const addToWord = useCallback(
    (letter: string, idx: number) => () => {
      setWord((w) => [...w, letter])
      setOtherLetters((ls) => {
        const newLetters = [...ls]
        newLetters.splice(idx, 1)
        return newLetters
      })
    },
    []
  )

  const removeFromWord = useCallback(
    (letter: string, idx: number) => () => {
      setWord((w) => {
        const newWord = [...w]
        newWord.splice(idx, 1)
        return newWord
      })
      setOtherLetters((ls) => [...ls, letter])
    },
    []
  )

  return (
    <div>
      <label>Votre nouveau mot</label>
      <p>
        {word.map((letter, idx) => (
          <>
            <Letter letter={letter} key={`${letter}${idx}`} onClick={removeFromWord(letter, idx)} />{" "}
          </>
        ))}
      </p>
      <label>Lettres disponibles</label>
      <p>
        {otherLetters.map((letter, idx) => (
          <>
            <Letter letter={letter} key={`${letter}${idx}`} onClick={addToWord(letter, idx)} />{" "}
          </>
        ))}
      </p>
      <button disabled={!canConfirm} onClick={() => onConfirm(word, otherLetters)}>
        Valider
      </button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  )
}

export default MakeAWord
