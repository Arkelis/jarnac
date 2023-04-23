import { useState } from "react"
import { Link } from "react-router-dom"
import CreateNewOnlineGame from "features/CreateNewOnlineGame/CreateNewOnlineGame"
import JoinOnlineGame from "features/JoinOnlineGame/JoinOnlineGame"

interface Props {
  localGamePath: string
  navigateToGame: (id: string) => void
}

function Start({ localGamePath, navigateToGame }: Props) {
  const [isCreatingGame, setIsCreatingGame] = useState(false)
  const [isJoiningGame, setIsJoiningGame] = useState(false)

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
          onGameCreated={navigateToGame}
        />
      </li>
      <li>
        <button onClick={() => setIsJoiningGame(true)}>Rejoindre une partie en ligne</button>
        <JoinOnlineGame
          open={isJoiningGame}
          onCancel={() => setIsJoiningGame(false)}
          onGameJoined={navigateToGame}
        />
      </li>
    </ul>
  )
}

export default Start
