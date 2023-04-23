import { ButtonHTMLAttributes } from "react"

interface Props {
  letter: string
}

type ButtonAttributes = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role">

function Letter({ letter, ...props }: Props & ButtonAttributes) {
  return (
    <span role="button" {...props}>
      {letter}
    </span>
  )
}

export default Letter
