import { useRef, useState } from "react";
import { Bag } from "../bag";

interface Props {
  anonymizedName: string;
  defaultName?: string
  draw: () => string;
  onCreated: (teamName: string, letter: string) => void;
}

function CreateTeam({ anonymizedName, defaultName, draw, onCreated }: Props) {
  const [name, setName] = useState<string | undefined>(defaultName);
  const [letter, setLetter] = useState<string>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (name === undefined) {
    return (
      <form>
        <p>{anonymizedName}, quel est votre nom ?</p>
        <input ref={inputRef} />
        <button type="submit" onClick={() => setName(inputRef.current?.value)}>
          Enregistrer
        </button>
      </form>
    );
  }

  if (letter === undefined) {
    return (
      <>
        <p>Equipe {name}, tirez une lettre !</p>
        <button onClick={() => setLetter(draw())}>Tirer !</button>
      </>
    );
  }

  return (
    <>
      <p>
        Equipe {name}, tirez une lettre ! <strong>{letter}</strong>
      </p>
      <button onClick={() => onCreated(name, letter)}>Continuer</button>
    </>
  );
}

export default CreateTeam;
