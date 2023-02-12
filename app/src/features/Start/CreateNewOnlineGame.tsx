import { createNewGame } from "db/client";
import { useEffect, useRef, useState } from "react";

interface Props {
  onGameCreated: (id: string) => void;
  onCancel: () => void;
  open: boolean;
}

function useDialogManagement(open: boolean) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialogRef.current === null) return;
    if (open) return dialogRef.current.showModal();
    return dialogRef.current.close();
  }, [open]);
  return dialogRef;
}

function CreateNewOnlineGame({ onGameCreated, onCancel, open }: Props) {
  const isCreatingRef = useRef(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dialogRef = useDialogManagement(open);

  useEffect(() => {
    if (!open) return;
    if (!isCreatingRef.current) return;
    createNewGame().then(({ data, error }) => {
      if (error || data === null || data.length === 0) {
        isCreatingRef.current = false;
        setIsError(true);
      } else if (data) {
        isCreatingRef.current = false;
        setIsSuccess(true);
        onGameCreated(data[0].id);
      }
    });
  }, [open]);

  return (
    <dialog ref={dialogRef}>
      <button onClick={onCancel}>Retour</button>
      {isError && <div>Une erreur est survenue.</div>}
      {isSuccess && <div>Vous allez entrer dans la partie !</div>}
      {!isError && !isSuccess && <div>Création de la partie en cours</div>}
    </dialog>
  );
}

export default CreateNewOnlineGame;
