import { useCreateGame } from "db/queries";
import { useEffect, useRef } from "react";

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
  const dialogRef = useDialogManagement(open);
  const { mutate, reset, isLoading, isSuccess, isError } = useCreateGame({
    onSuccess: (id: string) => onGameCreated(id),
  });

  useEffect(() => {
    if (!open) return;
    mutate();
  }, [open, mutate]);

  return (
    <dialog ref={dialogRef}>
      <button
        onClick={() => {
          reset();
          onCancel();
        }}
      >
        Retour
      </button>
      {isError && <div>Une erreur est survenue.</div>}
      {isSuccess && <div>Vous allez entrer dans la partie !</div>}
      {isLoading && <div>Création de la partie en cours</div>}
    </dialog>
  );
}

export default CreateNewOnlineGame;
