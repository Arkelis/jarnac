interface Props {
  lines: string[][]
  lineMustBeChosen: boolean
  onLineChoice: (idx: number) => void
}

function Board({ lines, lineMustBeChosen, onLineChoice }: Props) {
  return (
    <ul>
      {Array(9)
        .fill(undefined)
        .map((_, idx) => (
          <li key={idx}>
            {lineMustBeChosen && (
              <span className="mr-2 underline cursor-pointer" onClick={() => onLineChoice(idx)}>
                Sélectionner
              </span>
            )}
            {lines[idx]?.join("") || "_"}
          </li>
        ))}
    </ul>
  )
}

export default Board
