import ApproveWord from "features/ApproveWord/ApproveWord";
import Board from "features/Board/Board";
import {
  ActionType,
  GameActions,
  PendingWord,
} from "features/Game/useGameActions";
import MakeAWord from "features/MakeAWord/MakeAWord";
import { useCallback, useState } from "react";
import { Team } from "types";
import { useLineChoice } from "./useLineChoice";

interface Props extends GameActions {
  possibleActions: ActionType[];
  team: Team;
  lines: string[][];
  letters: string[];
  pendingWord: PendingWord | null;
}

function Set({
  possibleActions,
  lines,
  letters,
  init,
  take,
  proposeWord,
  pendingWord,
  approveWord,
  refuseWord,
  pass,
}: Props) {
  const {
    chosenLine,
    lineMustBeChosen,
    setDefaultLineChoiceOrAsk,
    handleLineChoice,
    resetChosenLine,
  } = useLineChoice();
  const [isMakingAWord, setIsMakingAWord] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);

  const initiateSet = useCallback(() => {
    init();
    setIsInitiated(true);
  }, []);

  const prepareMakeAWord = useCallback(() => {
    setIsMakingAWord(true);
    setDefaultLineChoiceOrAsk(lines);
  }, [lines]);

  return (
    <div>
      <hr />
      <Board
        lines={lines}
        lineMustBeChosen={lineMustBeChosen}
        onLineChoice={handleLineChoice}
      />
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
      {isMakingAWord && chosenLine !== undefined && (
        <MakeAWord
          letters={letters}
          line={lines.at(chosenLine) || []}
          onConfirm={(word: string[], otherLetters: string[]) => {
            proposeWord({ word, lineIndex: chosenLine, otherLetters });
            setIsMakingAWord(false);
            resetChosenLine();
          }}
          onCancel={() => {
            setIsMakingAWord(false);
            resetChosenLine();
          }}
        />
      )}
      {possibleActions.includes(ActionType.approveWord) &&
        pendingWord !== null && (
          <ApproveWord
            approveWord={approveWord}
            refuseWord={refuseWord}
            word={pendingWord.word}
          />
        )}
    </div>
  );
}

export default Set;
