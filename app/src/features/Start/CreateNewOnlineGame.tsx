import { createNewGame } from "db/client";
import { useEffect, useState } from "react";

interface Props {
  onGameCreated: (id: string) => void;
  onCancel: () => void;
  open: boolean;
}

function CreateNewOnlineGame({ open, onGameCreated, onCancel }: Props) {
  const [isCreating, setIsCreating] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isCreating) return;
    createNewGame().then(({ data, error }) => {
      if (error || data === null || data.length === 0) {
        setIsCreating(false);
        return setIsError(true);
      }
      if (data) {
        setIsCreating(false);
        setIsSuccess(true);
        onGameCreated(data[0].id);
      }
    });
  }, [isCreating]);

  return (
    <dialog open={open}>
      <button onClick={onCancel}>Retour</button>
      {isError && <div>Une erreur est survenue.</div>}
      {isSuccess && <div>Vous allez entrer dans la partie !</div>}
      {!isError && !isSuccess && <div>Création de la partie en cours</div>}
    </dialog>
  );
}

export default CreateNewOnlineGame;
