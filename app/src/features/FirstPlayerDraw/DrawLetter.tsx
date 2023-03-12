import { useState } from "react";

interface Props {
  name: string;
  draw: () => string;
  onDrawn: (letter: string) => void;
  interactionsEnabled: boolean;
}

function DrawLetter({ name, draw, onDrawn, interactionsEnabled }: Props) {
  const [letter, setLetter] = useState<string>();

  if (letter === undefined) {
    return (
      <>
        <p>Equipe {name}, tirez une lettre !</p>
        <button
          disabled={!interactionsEnabled}
          onClick={() => {
            const newLetter = draw();
            setLetter(newLetter);
            onDrawn(newLetter);
          }}
        >
          Tirer !
        </button>
      </>
    );
  }

  return (
    <>
      <p>
        Équipe {name}, votre lettre est <strong>{letter}</strong>
      </p>
    </>
  );
}

export default DrawLetter;
