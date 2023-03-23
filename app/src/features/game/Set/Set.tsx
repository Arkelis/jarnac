import ApproveWord from "features/game/ApproveWord/ApproveWord"
import Board from "features/game/Board/Board"
import { ActionType, GameActions, GameState } from "features/game/Game/useGameActions"
import MakeAWord from "features/game/MakeAWord/MakeAWord"
import SwapLettersSection from "features/game/SwapLetters/SwapLettersSection"
import { useCallback, useState } from "react"
import { opponent, Team } from "types"
import { useLineChoice } from "./useLineChoice"

interface Props extends GameActions {
  team: Team
  gameState: GameState
}

function Set({
  team,
  gameState,
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
  const [isInitiated, setIsInitiated] = useState(false)

  const { pendingWord } = gameState
  const { name, possibleActions } = gameState[team]
  const { board: lines, letters } = gameState[isMakingJarnac ? opponent(team) : team]

  console.log(lines)

  const initiateSet = useCallback(() => {
    init()
    setIsInitiated(true)
  }, [])

  const prepareMakeAWord = useCallback(() => {
    setIsMakingAWord(true)
    setDefaultLineChoiceOrAsk(lines)
  }, [lines])

  const prepareJarnac = () => {
    setIsMakingJarnac(true)
    setDefaultLineChoiceOrAsk(gameState[opponent(team)].board)
  }

  return (
    <div>
      <p>Plateau de l&apos;équipe {name}</p>
      <hr />
      <Board lines={lines} lineMustBeChosen={lineMustBeChosen} onLineChoice={handleLineChoice} />
      <div>
        <p>Lettres</p>
        <p>
          {letters.map((letter, idx) => (
            <button disabled key={idx}>
              {letter}
            </button>
          ))}
        </p>
      </div>
      {possibleActions.length > 0 && <p>{"C'est à vous de jouer !"}</p>}
      {possibleActions.includes(ActionType.jarnac) && !isMakingAWord && (
        <button onClick={prepareJarnac}>JARNAC</button>
      )}
      {possibleActions.includes(ActionType.take) && !isInitiated && (
        <button onClick={initiateSet}>Tirer 6 lettres pour commencer</button>
      )}
      {possibleActions.includes(ActionType.take) && isInitiated && (
        <button onClick={take}>Piocher une lettre</button>
      )}
      {possibleActions.includes(ActionType.proposeWord) && !isMakingAWord && (
        <button onClick={prepareMakeAWord}>Fabriquer un nouveau mot</button>
      )}
      {possibleActions.includes(ActionType.pass) && !isMakingAWord && (
        <button onClick={pass}>Passer</button>
      )}
      <SwapLettersSection
        letters={letters}
        isInitiated={isInitiated}
        onConfirmSwap={swap}
        possibleActions={possibleActions}
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
      {possibleActions.includes(ActionType.approveWord) && pendingWord !== null && (
        <ApproveWord approveWord={approveWord} refuseWord={refuseWord} word={pendingWord.word} />
      )}
      {possibleActions.includes(ActionType.approveJarnac) && pendingWord !== null && (
        <ApproveWord approveWord={approveJarnac} refuseWord={refuseJarnac} word={pendingWord.word} />
      )}
    </div>
  )
}

export default Set
