import { useRef, useState } from "react";

interface Props {
  defaultName: string;
  definedName?: string;
  draw: () => string;
  onCreated: (teamName: string, letter: string) => void;
}

function CreateTeam({ defaultName, definedName, draw, onCreated }: Props) {
  const [name, setName] = useState<string | undefined>(definedName);
  const [letter, setLetter] = useState<string>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (name === undefined) {
    return (
      <form>
        <p>Entrer un nom pour l&apos;équipe</p>
        <input ref={inputRef} defaultValue={defaultName} />
        <button onClick={() => setName(inputRef.current?.value)}>
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
        Votre lettre est <strong>{letter}</strong>
      </p>
      <button onClick={() => onCreated(name, letter)}>Continuer</button>
    </>
  );
}

export default CreateTeam;
