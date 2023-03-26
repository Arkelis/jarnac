export type Bag = string[]

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function initialBag() {
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

export function takeALetter(bag: Bag) {
  if (bag.length === 0) {
    throw new TypeError("Bag is empty")
  }
  const newBag = [...bag]
  const letter = newBag.splice(randomInt(newBag.length), 1).at(0) as string
  return { newBag, letter }
}

export function swapThreeLetters(bag: Bag, letters: string[]) {
  if (bag.length < 3) {
    throw new TypeError("Bag has less than 3 letters")
  }
  const newBag = [...bag]
  const newLetters = Array(3)
    .fill(undefined)
    .map(() => newBag.splice(randomInt(newBag.length), 1))
    .flat()
  return { newBag: [...newBag, ...letters], newLetters }
}
