import { useCallback, useState } from "react";

interface Props {
  letters: string[];
  line: string[];
  onConfirm: (word: string[], otherLetters: string[]) => void;
  onCancel: () => void;
}

function MakeAWord({ letters, line, onConfirm, onCancel }: Props) {
  const [word, setWord] = useState(line);
  const [otherLetters, setOtherLetters] = useState(letters);

  const addToWord = useCallback(
    (letter: string, idx: number) => () => {
      setWord((w) => [...w, letter]);
      setOtherLetters((ls) => {
        const newLetters = [...ls];
        newLetters.splice(idx, 1);
        return newLetters;
      });
    },
    []
  );

  const removeFromWord = useCallback(
    (letter: string, idx: number) => () => {
      setWord((w) => {
        const newWord = [...w];
        newWord.splice(idx, 1);
        return newWord;
      });
      setOtherLetters((ls) => [...ls, letter]);
    },
    []
  );

  return (
    <div>
      <label>Votre nouveau mot</label>
      <p>
        {word.map((letter, idx) => (
          <button key={`${letter}${idx}`} onClick={removeFromWord(letter, idx)}>
            {letter}
          </button>
        ))}
      </p>
      <label>Lettres disponibles</label>
      <ul>
        {otherLetters.map((letter, idx) => (
          <li key={`${letter}${idx}`}>
            <button onClick={addToWord(letter, idx)}>{letter}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onConfirm(word, otherLetters)}>Valider</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  );
}

export default MakeAWord;
