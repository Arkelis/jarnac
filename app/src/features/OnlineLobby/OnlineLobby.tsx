import { useRef, useState } from "react";

interface Props {
  isOrganizer: boolean;
}

function OnlineLobby({ isOrganizer }: Props) {
  const [name, setName] = useState<string>();
  const nameInputRef = useRef<HTMLInputElement>(null);

  if (name === undefined) {
    return (
      <>
        <p>Bonjour, quel est votre nom ?</p>
        <form>
          <input ref={nameInputRef} type="text" />
          <button onClick={() => setName(nameInputRef.current?.value)}>
            Valider
          </button>
        </form>
      </>
    );
  }
  return <div>Lobby</div>;
}

export default OnlineLobby;
