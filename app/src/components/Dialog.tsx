import { ReactNode, useEffect, useRef } from "react"

interface Props {
  children: ReactNode
  open: boolean
}

function Dialog({ open, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (dialogRef.current === null) return
    if (open) return dialogRef.current.showModal()
    return dialogRef.current.close()
  }, [open])

  return <dialog ref={dialogRef}>{children}</dialog>
}

export default Dialog
