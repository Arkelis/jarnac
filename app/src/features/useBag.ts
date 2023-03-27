import { useFetchBag, useUpdateBag } from "db/queries/bag"
import { Bag, initialBag, swapThreeLetters, takeALetter } from "models/bag"
import { useCallback, useState } from "react"

export function useBag(gameId?: string) {
  const [bag, setBag] = useState(gameId ? [] : initialBag())

  // online synchronization
  useFetchBag({
    gameId,
    onSuccess: (fetchedBag) => {
      setBag(fetchedBag)
    },
  })
  const { mutate } = useUpdateBag({ gameId })
  console.log("bag state", bag)

  const updateBag = useCallback(
    (newBag: Bag) => {
      setBag(newBag)
      mutate(newBag)
    },
    [setBag, mutate]
  )

  const draw = useCallback(() => {
    console.log("draw in", bag)
    const { newBag, letter } = takeALetter(bag)
    updateBag(newBag)
    return letter
  }, [bag, updateBag])

  const swapThree = useCallback(
    (letters: string[]) => {
      const { newBag, newLetters } = swapThreeLetters(bag, letters)
      updateBag(newBag)
      return newLetters
    },
    [bag, updateBag]
  )

  const discard = useCallback(
    (letter?: string) => {
      const newBag = letter ? [...bag, letter] : bag
      updateBag(newBag)
    },
    [bag, updateBag]
  )
  const reset = useCallback(() => updateBag(initialBag()), [updateBag])

  return { bag, draw, discard, swapThree, reset }
}
