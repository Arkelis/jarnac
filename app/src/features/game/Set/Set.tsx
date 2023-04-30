import Letter from "components/Letter"
import ApproveWord from "features/game/ApproveWord/ApproveWord"
import Board from "features/game/Board/Board"
import { GameActions } from "features/game/Game/useGameActions"
import MakeAWord from "features/game/MakeAWord/MakeAWord"
import SwapLettersSection from "features/game/SwapLetters/SwapLettersSection"
import { computeScore, GameState } from "models/game"
import { useCallback, useEffect, useState } from "react"
import { opponent, Team } from "types"
import { useLineChoice } from "./useLineChoice"

interface Props extends GameActions {
  team: Team
  teamName: string
  gameState: GameState
  onlineTeam?: Team | null
}

function Set({
  team,
  teamName,
  gameState,
  onlineTeam,
  init,
  take,
  swap,
  proposeWord,
  approveWord,
  refuseWord,
  proposeJarnac,
  approveJarnac,
  refuseJarnac,
  pass,
}: Props) {
  const { chosenLine, lineMustBeChosen, setDefaultLineChoiceOrAsk, handleLineChoice, resetChosenLine } =
    useLineChoice()
  const [isMakingAWord, setIsMakingAWord] = useState(false)
  const [isMakingJarnac, setIsMakingJarnac] = useState(false)
  const isMakingWordOrJarnac = isMakingAWord || isMakingJarnac

  const { pendingWord } = gameState
  const { possibleActions, initiated } = gameState[team]
  const { board: lines, letters } = gameState[isMakingJarnac ? opponent(team) : team]
  const gameIsFinished = lines.length === 9 || gameState[opponent(team)].board.length === 9
  const ownsSet = (onlineTeam === undefined || onlineTeam === team) && !gameIsFinished

  const points = computeScore(lines)
  const opponentPoints = computeScore(gameState[opponent(team)].board)

  const prepareMakeAWord = useCallback(() => {
    setIsMakingAWord(true)
    setDefaultLineChoiceOrAsk(lines)
  }, [lines, setDefaultLineChoiceOrAsk])

  const prepareJarnac = () => {
    setIsMakingJarnac(true)
    setDefaultLineChoiceOrAsk(gameState[opponent(team)].board)
  }

  useEffect(() => {
    if (!ownsSet) return
    if (!possibleActions.includes("jarnac")) return
    if (isMakingWordOrJarnac) return
    document.addEventListener("keydown", prepareJarnac)
    return () => document.removeEventListener("keydown", prepareJarnac)
  })

  return (
    <div>
      <p>Plateau de l&apos;équipe {teamName}</p>
      <hr />
      <Board lines={lines} lineMustBeChosen={lineMustBeChosen} onLineChoice={handleLineChoice} />
      <div>
        <p>Lettres</p>
        <p>
          {letters.map((letter, idx) => (
            <>
              <Letter letter={letter} disabled key={idx} />{" "}
            </>
          ))}
        </p>
      </div>
      {ownsSet && possibleActions.length > 0 && <p>{"C'est à vous de jouer !"}</p>}
      {!ownsSet && possibleActions.length > 0 && <p>{"C'est à l'adversaire de jouer !"}</p>}
      {ownsSet && possibleActions.includes("jarnac") && !isMakingWordOrJarnac && (
        <button onClick={prepareJarnac}>JARNAC</button>
      )}
      {ownsSet && possibleActions.includes("take") && !initiated && !isMakingWordOrJarnac && (
        <button onClick={init}>Tirer 6 lettres pour commencer</button>
      )}
      {ownsSet && possibleActions.includes("take") && initiated && !isMakingWordOrJarnac && (
        <button onClick={take}>Piocher une lettre</button>
      )}
      {ownsSet && possibleActions.includes("proposeWord") && !isMakingWordOrJarnac && (
        <button onClick={prepareMakeAWord}>Fabriquer un nouveau mot</button>
      )}
      {ownsSet && possibleActions.includes("pass") && !isMakingWordOrJarnac && (
        <button onClick={pass}>Passer</button>
      )}
      <SwapLettersSection
        canPlay={ownsSet && possibleActions.includes("take") && initiated}
        letters={letters}
        onConfirmSwap={swap}
      />
      {isMakingAWord && chosenLine !== undefined && (
        <MakeAWord
          letters={letters}
          line={lines.at(chosenLine) || []}
          onConfirm={(word: string[], otherLetters: string[]) => {
            proposeWord({ word, lineIndex: chosenLine, otherLetters })
            setIsMakingAWord(false)
            resetChosenLine()
          }}
          onCancel={() => {
            setIsMakingAWord(false)
            resetChosenLine()
          }}
        />
      )}
      {isMakingJarnac && chosenLine !== undefined && (
        <MakeAWord
          letters={letters}
          line={lines.at(chosenLine) || []}
          onConfirm={(word: string[], otherLetters: string[]) => {
            proposeJarnac({ word, lineIndex: chosenLine, otherLetters })
            setIsMakingJarnac(false)
            resetChosenLine()
          }}
          onCancel={() => {
            setIsMakingJarnac(false)
            resetChosenLine()
          }}
        />
      )}
      {ownsSet && possibleActions.includes("approveWord") && pendingWord !== null && (
        <ApproveWord approveWord={approveWord} refuseWord={refuseWord} word={pendingWord.word} />
      )}
      {ownsSet && possibleActions.includes("approveJarnac") && pendingWord !== null && (
        <ApproveWord approveWord={approveJarnac} refuseWord={refuseJarnac} word={pendingWord.word} />
      )}
      {gameIsFinished && (
        <div>
          <p>
            <strong>{points > opponentPoints ? "Victoire !" : "Défaite !"}</strong>
          </p>
          <p>{`Votre score : ${points} points`}</p>
        </div>
      )}
    </div>
  )
}

export default Set
