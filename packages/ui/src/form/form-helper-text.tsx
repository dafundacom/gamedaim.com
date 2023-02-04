import * as React from "react"
import { tx } from "@twind/core"

import { useFormControl } from "./form-control"

export interface FormHelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType
  colorScheme?: string
}

export const FormHelperText = React.forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>((props, ref) => {
  const { as: Comp = "p", colorScheme = "gray", className, id, ...rest } = props

  const classes = tx(
    `mt-1.5 text-xs text-${colorScheme}-500 dark:text-${colorScheme}-600`,
    className,
  )
  const formControl = useFormControl({})

  return (
    <Comp
      ref={ref}
      className={classes}
      id={id || formControl.helpTextId}
      {...rest}
    />
  )
})
