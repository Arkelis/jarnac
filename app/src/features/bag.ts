import { initialBag, swapThreeLetters, takeALetter } from "models/bag"
import { useCallback, useState } from "react"

export function useBag(online = false) {
  const [bag, setBag] = useState(initialBag())
  const draw = useCallback(() => {
    const { newBag, letter } = takeALetter(bag)
    setBag(newBag)
    return letter
  }, [bag])
  const swapThree = useCallback(
    (letters: string[]) => {
      const { newBag, newLetters } = swapThreeLetters(bag, letters)
      setBag(newBag)
      return newLetters
    },
    [bag]
  )
  const discard = useCallback(
    (letter?: string) => setBag((bag) => (letter ? [...bag, letter] : bag)),
    []
  )

  return { bag, draw, discard, swapThree }
}
