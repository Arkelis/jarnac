import React, { useState } from "react";
import FirstPlayerDraw from "./features/FirstPlayerDraw/FirstPlayerDraw";

function App() {
  const [step, setStep] = useState("draw");
  const [players, setPlayers] = useState<string[]>([]);
  return step === "draw" ? (
    <FirstPlayerDraw
      onAllPlayersSorted={(sortedPlayers) => {
        setStep("play");
        setPlayers(sortedPlayers);
      }}
    />
  ) : (
    <pre>{JSON.stringify(players)}</pre>
  );
}

export default App;
