import { useFetchTeamNames } from "db/queries/teams"
import OnlineGame from "features/OnlineGame/OnlineGame"
import { Navigate, useParams } from "react-router-dom"

function OnlineGamePage() {
  const { gameId } = useParams()
  const { data, isInitialLoading } = useFetchTeamNames({ gameId })

  if (isInitialLoading) return <p>Chargement en cours</p>
  if (!data || !gameId) return <Navigate to="/jarnac/" />

  return <OnlineGame gameId={gameId} />
}

export default OnlineGamePage
