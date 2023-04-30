import { useFetchGame } from "db/queries/game"
import { initialBag, swapThreeLetters, takeALetter, takeSixLetters } from "models/bag"
import { useCallback, useState } from "react"

export function useBag(gameId?: string) {
  const [bag, setBag] = useState(gameId ? [] : initialBag())

  useFetchGame({
    gameId,
    onSuccess: ({ bag }) => setBag(bag),
  })

  const drawSix = useCallback(() => {
    const { newBag, newLetters } = takeSixLetters(bag)
    setBag(newBag)
    return { newBag, newLetters }
  }, [bag, setBag])

  const draw = useCallback(() => {
    const { newBag, letter } = takeALetter(bag)
    setBag(newBag)
    return { letter, newBag }
  }, [bag, setBag])

  const swapThree = useCallback(
    (letters: string[]) => {
      const { newBag, newLetters } = swapThreeLetters(bag, letters)
      setBag(newBag)
      return { newBag, newLetters }
    },
    [bag, setBag]
  )

  const discard = useCallback(
    (letter?: string) => {
      const newBag = letter ? [...bag, letter] : bag
      setBag(newBag)
      return { newBag }
    },
    [bag, setBag]
  )
  const reset = useCallback(() => setBag(initialBag()), [setBag])

  return { bag, draw, drawSix, discard, swapThree, reset }
}
