import { useState } from "react"
import { Link } from "react-router-dom"
import CreateNewOnlineGame from "features/CreateNewOnlineGame/CreateNewOnlineGame"

interface Props {
  localGamePath: string
  onGameCreated: (id: string) => void
}

function Start({ localGamePath, onGameCreated }: Props) {
  const [isCreatingGame, setIsCreatingGame] = useState(false)

  return (
    <ul>
      <li>
        <Link to={localGamePath}>
          <button>Jeu local</button>
        </Link>
      </li>
      <li>
        <button onClick={() => setIsCreatingGame(true)}>Créer une partie en ligne</button>
        <CreateNewOnlineGame
          open={isCreatingGame}
          onCancel={() => setIsCreatingGame(false)}
          onGameCreated={onGameCreated}
        />
      </li>
      <li>
        <button>Rejoindre une partie en ligne</button>
      </li>
    </ul>
  )
}

export default Start
