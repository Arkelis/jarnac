import { useFetchGame } from "db/queries";
import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { Navigate, useParams } from "react-router-dom";

function OnlineGamePage() {
  const { id } = useParams();
  const { data, isInitialLoading } = useFetchGame({ id });

  if (isInitialLoading) return <p>Chargement en cours</p>;
  if (data === undefined) return <Navigate to="/" />;

  return <OnlineLobby gameId={data.id} />;
}

export default OnlineGamePage;
