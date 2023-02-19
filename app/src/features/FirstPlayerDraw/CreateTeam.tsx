import { useRef, useState } from "react";

interface Props {
  defaultName: string;
  definedName?: string;
  draw: () => string;
  onCreated: (teamName: string, letter: string) => void;
  interactionsEnabled: boolean;
}

function CreateTeam({
  defaultName,
  definedName,
  draw,
  onCreated,
  interactionsEnabled,
}: Props) {
  const [name, setName] = useState<string | undefined>(definedName);
  const [letter, setLetter] = useState<string>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (name === undefined) {
    return (
      <form>
        <p>Entrer un nom pour l&apos;équipe</p>
        <input
          disabled={!interactionsEnabled}
          ref={inputRef}
          defaultValue={defaultName}
        />
        <button
          disabled={!interactionsEnabled}
          onClick={() => setName(inputRef.current?.value)}
        >
          Enregistrer
        </button>
      </form>
    );
  }

  if (letter === undefined) {
    return (
      <>
        <p>Equipe {name}, tirez une lettre !</p>
        <button
          disabled={!interactionsEnabled}
          onClick={() => {
            const newLetter = draw();
            setLetter(newLetter);
            onCreated(name, newLetter);
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

export default CreateTeam;
