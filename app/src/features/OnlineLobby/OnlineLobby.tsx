import EnterName from "./EnterName"
import { Team, Teams } from "types"
import { Dispatch, SetStateAction, useRef } from "react"
import { UserPayload } from "db/realtime"

interface Props {
  gameId: string
  users: UserPayload[]
  name?: string
  team: Team | null
  onlineTeam: Team | null
  teamNames: Teams
  setTeam: Dispatch<SetStateAction<Team | null>>
  setName: Dispatch<SetStateAction<string | undefined>>
  onTeamNameChange: (params: { team: Team; name: string }) => void
}

function OnlineLobby({ users, name, onlineTeam, teamNames, setTeam, setName, onTeamNameChange }: Props) {
  const teamOneNameRef = useRef<HTMLInputElement>(null)
  const teamTwoNameRef = useRef<HTMLInputElement>(null)
  const { team1, team2 } = teamNames

  if (name === undefined) return <EnterName onSubmitName={setName} />
  return (
    <details>
      <summary>Composition des équipes</summary>
      <p>Copiez ce lien pour inviter vos amis dans la partie : {window.location.toString()}</p>
      <div className="grid">
        <div>
          <h3>{team1}</h3>
          <ul>
            {users?.map(({ id, name, team }) => (team === Team.team1 ? <li key={id}>{name}</li> : null))}
          </ul>
          <button onClick={() => setTeam(Team.team1)}>Rejoindre</button>
          <input disabled={onlineTeam !== Team.team1} ref={teamOneNameRef} />
          <button
            disabled={onlineTeam !== Team.team1}
            onClick={() =>
              onTeamNameChange({
                team: Team.team1,
                name: teamOneNameRef.current?.value || team1,
              })
            }
          >
            Changer le nom
          </button>
        </div>
        <div>
          <h3>{team2}</h3>
          <ul>
            {users?.map(({ id, name, team }) => (team === Team.team2 ? <li key={id}>{name}</li> : null))}
          </ul>
          <button onClick={() => setTeam(Team.team2)}>Rejoindre</button>
          <input disabled={onlineTeam !== Team.team2} ref={teamTwoNameRef} />
          <button
            disabled={onlineTeam !== Team.team2}
            onClick={() =>
              onTeamNameChange({
                team: Team.team2,
                name: teamTwoNameRef.current?.value || team2,
              })
            }
          >
            Changer le nom
          </button>
        </div>
      </div>
    </details>
  )
}

export default OnlineLobby
