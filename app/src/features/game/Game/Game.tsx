import Set from "features/game/Set/Set"
import { Team, Teams } from "types"
import { useGameActions } from "./useGameActions"

interface Props {
  teamNames: Teams
  firstTeam: Team
  gameId?: string
  onlineTeam?: Team | null
}

function Game({ teamNames, firstTeam, gameId, onlineTeam }: Props) {
  const { team1: teamOneName, team2: teamTwoName } = teamNames
  const { gameState, ...actions } = useGameActions({
    firstTeam,
    gameId,
  })

  return (
    <>
      <div className="grid">
        <Set
          onlineTeam={onlineTeam}
          team={Team.team1}
          teamName={teamOneName}
          gameState={gameState}
          {...actions}
        />
        <Set
          onlineTeam={onlineTeam}
          team={Team.team2}
          teamName={teamTwoName}
          gameState={gameState}
          {...actions}
        />
      </div>
    </>
  )
}

export default Game
