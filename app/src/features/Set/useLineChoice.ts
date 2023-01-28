import { useCallback, useState } from "react";

export function useLineChoice() {
  const [lineMustBeChosen, setLineMustBeChosen] = useState(false);
  const [chosenLine, setChosenLine] = useState<number | undefined>();

  const handleLineChoice = useCallback((idx: number) => {
    setLineMustBeChosen(false);
    setChosenLine(idx);
  }, []);

  return {
    chosenLine,
    setChosenLine,
    lineMustBeChosen,
    setLineMustBeChosen,
    handleLineChoice,
  };
}
