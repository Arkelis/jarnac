import { useFetchGame } from "db/queries";
import OnlineGame from "features/OnlineGame/OnlineGame";
import { Navigate, useParams } from "react-router-dom";

function OnlineGamePage() {
  const { id } = useParams();
  const { data, isInitialLoading } = useFetchGame({ id });

  if (isInitialLoading) return <p>Chargement en cours</p>;
  if (data === undefined) return <Navigate to="/" />;

  return <OnlineGame gameId={data.id} />;
}

export default OnlineGamePage;
