import Start from "features/Start/Start"
import { useNavigate } from "react-router-dom"

function StartPage() {
  const navigate = useNavigate()
  return <Start localGamePath="/local" onGameCreated={(id) => navigate(`/en-ligne/${id}`)} />
}

export default StartPage
