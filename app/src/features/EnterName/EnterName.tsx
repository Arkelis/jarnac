import { useCallback, useRef } from "react"

interface Props {
  onSubmitName: (name: string) => void
}

function EnterName({ onSubmitName }: Props) {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const handleSubmit = useCallback(() => {
    if (!nameInputRef.current) return
    onSubmitName(nameInputRef.current.value)
  }, [onSubmitName])

  return (
    <>
      <p>Bonjour, quel est votre nom ?</p>
      <form>
        <input ref={nameInputRef} type="text" />
        <button onClick={handleSubmit}>Valider</button>
      </form>
    </>
  )
}

export default EnterName
