import * as React from "react"
import { tx } from "@twind/core"

import { useFormControl } from "./form-control"

export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>((props, ref) => {
  const { className, id, ...rest } = props
  const classes = tx(
    "mt-1.5 leading-none flex items-center text-sm text-red-500 dark:text-red-700",
    className,
  )
  const formControl = useFormControl({})

  return (
    <div
      ref={ref}
      className={classes}
      id={id || formControl.errorId}
      {...rest}
    />
  )
})
