import OnlineLobby from "features/OnlineLobby/OnlineLobby";
import { Navigate, useParams } from "react-router-dom";

function OnlineGamePage() {
  const { id } = useParams();

  if (id === undefined) return <Navigate to="/" />;

  return <OnlineLobby gameId={id} />;
}

export default OnlineGamePage;
