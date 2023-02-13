import { useCallback, useState } from "react";

export function useLineChoice() {
  const [lineMustBeChosen, setLineMustBeChosen] = useState(false);
  const [chosenLine, setChosenLine] = useState<number | undefined>();

  const handleLineChoice = useCallback((idx: number) => {
    setLineMustBeChosen(false);
    setChosenLine(idx);
  }, []);

  const setDefaultLineChoiceOrAsk = useCallback(
    (lines: string[][]) => {
      if (lines.length === 0) return setChosenLine(0);
      setLineMustBeChosen(true);
    },
    [setChosenLine, setLineMustBeChosen]
  );

  const resetChosenLine = () => setChosenLine(undefined);

  return {
    chosenLine,
    lineMustBeChosen,
    handleLineChoice,
    setDefaultLineChoiceOrAsk,
    resetChosenLine,
  };
}
