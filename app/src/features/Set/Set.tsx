import Board from "features/Board/Board";
import type { GameActions } from "features/Game/useGameActions";
import MakeAWord from "features/MakeAWord/MakeAWord";
import { useCallback, useState } from "react";
import { Team } from "types";
import { useLineChoice } from "./useLineChoice";

interface Props extends GameActions {
  playing: boolean;
  team: Team;
  lines: string[][];
  letters: string[];
}

function Set({ team, playing, lines, letters, init }: Props) {
  const [isInitiated, setIsInitiated] = useState(false);
  const readyToPlay = isInitiated && playing;
  const {
    chosenLine,
    setChosenLine,
    lineMustBeChosen,
    setLineMustBeChosen,
    handleLineChoice,
  } = useLineChoice();
  const [isMakingAWord, setIsMakingAWord] = useState(false);
  const initBoard = useCallback(() => {
    init(team);
    setIsInitiated(true);
  }, [setIsInitiated]);

  const prepareMakeAWord = useCallback(() => {
    setIsMakingAWord(true);
    if (lines.length === 0) return setChosenLine(0);
    setLineMustBeChosen(true);
  }, []);

  return (
    <div>
      <hr />
      {playing && <p>{"C'est à jouer de jouer !"}</p>}
      {!isInitiated && (
        <button disabled={!playing} onClick={initBoard}>
          Tirer 6 lettres pour commencer
        </button>
      )}
      {readyToPlay && !isMakingAWord && (
        <button onClick={prepareMakeAWord}>Fabriquer un nouveau mot</button>
      )}
      <Board
        lines={lines}
        lineMustBeChosen={lineMustBeChosen}
        onLineChoice={handleLineChoice}
      />
      <div>
        <p>Lettres</p>
        <p>{letters.join(" ")}</p>
      </div>
      {isMakingAWord && chosenLine !== undefined && (
        <MakeAWord
          letters={letters}
          line={lines.at(chosenLine) || []}
          onConfirm={() => console.log("validé")}
        />
      )}
    </div>
  );
}

export default Set;
