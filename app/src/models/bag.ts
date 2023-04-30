export type Bag = string[]

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function initialBag(): Bag {
  return ([] as string[])
    .concat(Array(14).fill("A"))
    .concat(Array(4).fill("B"))
    .concat(Array(6).fill("C"))
    .concat(Array(5).fill("D"))
    .concat(Array(19).fill("E"))
    .concat(Array(2).fill("F"))
    .concat(Array(4).fill("G"))
    .concat(Array(2).fill("H"))
    .concat(Array(10).fill("I"))
    .concat(Array(1).fill("J"))
    .concat(Array(1).fill("K"))
    .concat(Array(4).fill("L"))
    .concat(Array(4).fill("M"))
    .concat(Array(10).fill("N"))
    .concat(Array(9).fill("O"))
    .concat(Array(4).fill("P"))
    .concat(Array(2).fill("Q"))
    .concat(Array(10).fill("R"))
    .concat(Array(10).fill("S"))
    .concat(Array(10).fill("T"))
    .concat(Array(6).fill("U"))
    .concat(Array(2).fill("V"))
    .concat(Array(1).fill("W"))
    .concat(Array(1).fill("X"))
    .concat(Array(1).fill("Y"))
    .concat(Array(2).fill("Z"))
}

function takeLetters(bag: Bag, n: number) {
  if (bag.length === 0) {
    throw new TypeError("Bag is empty")
  }

  const newBag = [...bag]
  const newLetters = Array(n)
    .fill(undefined)
    .map(() => newBag.splice(randomInt(newBag.length), 1))
    .flat()
  return { newBag, newLetters }
}

export function takeALetter(bag: Bag) {
  const { newBag, newLetters } = takeLetters(bag, 1)
  return { newBag, letter: newLetters[0] }
}

export function takeSixLetters(bag: Bag) {
  return takeLetters(bag, 6)
}

export function swapThreeLetters(bag: Bag, letters: string[]) {
  if (bag.length < 3) {
    throw new TypeError("Bag has less than 3 letters")
  }
  const { newBag, newLetters } = takeLetters(bag, 3)
  return { newBag: [...newBag, ...letters], newLetters }
}
