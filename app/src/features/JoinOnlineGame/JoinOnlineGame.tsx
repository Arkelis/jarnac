import Dialog from "components/Dialog"
import { useCallback, useRef } from "react"

interface Props {
  onGameJoined: (id: string) => void
  onCancel: () => void
  open: boolean
}

function JoinOnlineGame({ onGameJoined, onCancel, open }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSubmit = useCallback(() => {
    const val = inputRef.current?.value
    if (!val) return
    if (val.includes("/")) {
      const parts = val.split("/")
      const gameId = parts.at(-1)
      if (!gameId) return
      return onGameJoined(gameId)
    } else {
      onGameJoined(val)
    }
  }, [onGameJoined])

  return (
    <Dialog open={open}>
      <label>
        Entrer l&apos;identifiant de la partie
        <input ref={inputRef} />
      </label>
      <button onClick={handleSubmit}>Rejoindre</button>
      <button onClick={onCancel}>Retour</button>
    </Dialog>
  )
}

export default JoinOnlineGame
