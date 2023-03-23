interface Props {
  name: string;
  letter?: string;
  draw: () => string;
  onDrawn: (letter: string) => void;
  interactionsEnabled: boolean;
}

function DrawLetter({ name, letter, draw, onDrawn, interactionsEnabled }: Props) {
  if (letter === undefined) {
    return (
      <>
        <p>Equipe {name}, tirez une lettre !</p>
        <button disabled={!interactionsEnabled} onClick={() => onDrawn(draw())}>
          Tirer !
        </button>
      </>
    );
  }

  return (
    <>
      <p>
        Équipe {name}, votre lettre est <strong>{letter}</strong>
      </p>
    </>
  );
}

export default DrawLetter;
