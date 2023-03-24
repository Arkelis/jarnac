import Set from "features/game/Set/Set"
import { Team, Teams } from "types"
import { useGameActions } from "./useGameActions"

interface Props {
  teamNames: Teams
  firstTeam: Team
  online?: boolean
}

function Game({ teamNames, firstTeam, online = false }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames
  const { gameState, ...actions } = useGameActions({
    team1: teamOneName,
    team2: teamTwoName,
    firstTeam,
    online,
  })

  return (
    <>
      <div>
        <Set team={Team.team1} gameState={gameState} {...actions} />
        <Set team={Team.team2} gameState={gameState} {...actions} />
      </div>
    </>
  )
}

export default Game
