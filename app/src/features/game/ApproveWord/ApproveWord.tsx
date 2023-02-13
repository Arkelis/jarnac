interface Props {
  word: string[];
  approveWord: () => void;
  refuseWord: () => void;
}

function ApproveWord({ word, approveWord, refuseWord }: Props) {
  return (
    <div>
      <p>Le mot de l&apos;adversaire : {word.join("")}</p>
      <button onClick={approveWord}>Approuver</button>
      <button onClick={refuseWord}>Refuser</button>
    </div>
  );
}

export default ApproveWord;
