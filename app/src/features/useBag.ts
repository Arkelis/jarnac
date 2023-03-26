import { useFetchBag, useUpdateBag } from "db/queries/bag"
import { Bag, initialBag, swapThreeLetters, takeALetter } from "models/bag"
import { useCallback, useState } from "react"

export function useBag(gameId?: string) {
  const [bag, setBag] = useState(gameId ? initialBag() : [])

  // online synchronization
  useFetchBag({ gameId, onSuccess: (bag) => setBag(bag) })
  const { mutate } = useUpdateBag({ gameId })

  const updateBag = useCallback(
    (bag: Bag) => {
      setBag(bag)
      mutate(bag)
    },
    [setBag, mutate]
  )

  const draw = useCallback(() => {
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
    [updateBag]
  )
  const reset = useCallback(() => updateBag(initialBag()), [updateBag])

  return { bag, draw, discard, swapThree, reset }
}
