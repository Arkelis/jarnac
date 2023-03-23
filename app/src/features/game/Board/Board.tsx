interface Props {
  lines: string[][];
  lineMustBeChosen: boolean;
  onLineChoice: (idx: number) => void;
}

function Board({ lines, lineMustBeChosen, onLineChoice }: Props) {
  return (
    <ul>
      {Array(9)
        .fill(undefined)
        .map((_, idx) => (
          <li key={idx}>
            {lineMustBeChosen && (
              <button onClick={() => onLineChoice(idx)}>Sélectionner cette ligne</button>
            )}
            {lines[idx]?.join("") || "_"}
          </li>
        ))}
    </ul>
  );
}

export default Board;
