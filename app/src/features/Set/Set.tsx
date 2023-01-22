import { useCallback, useState } from "react";

interface Props {
  lines: string[][];
  letters: string[];
  takeSixLetters: () => void;
}

function Set({ lines, letters, takeSixLetters }: Props) {
  const [isInitiated, setIsInitiated] = useState(false);
  const initBoard = useCallback(() => {
    takeSixLetters();
    setIsInitiated(true);
  }, [takeSixLetters, setIsInitiated]);

  return (
    <div>
      {!isInitiated && (
        <button onClick={initBoard}>Tirer 6 lettres pour commencer</button>
      )}
      <ul>
        {lines.map((line: string[], idx) => (
          <li key={idx}>{line.join()}</li>
        ))}
      </ul>
      <div>
        <p>Lettres</p>
        <p>{letters.join(" ")}</p>
      </div>
    </div>
  );
}

export default Set;
