import Dialog from "components/Dialog"
import { useCreateGame } from "db/queries/game"
import { useEffect, useRef } from "react"

interface Props {
  onGameCreated: (id: string) => void
  onCancel: () => void
  open: boolean
}

function CreateNewOnlineGame({ onGameCreated, onCancel, open }: Props) {
  const { mutate, reset, isLoading, isSuccess, isError } = useCreateGame({
    onSuccess: (id: string) => onGameCreated(id),
  })

  useEffect(() => {
    if (!open) return
    mutate()
  }, [open, mutate])

  return (
    <Dialog open={open}>
      <button
        onClick={() => {
          reset()
          onCancel()
        }}
      >
        Retour
      </button>
      {isError && <div>Une erreur est survenue.</div>}
      {isSuccess && <div>Vous allez entrer dans la partie !</div>}
      {isLoading && <div>Création de la partie en cours</div>}
    </Dialog>
  )
}

export default CreateNewOnlineGame
