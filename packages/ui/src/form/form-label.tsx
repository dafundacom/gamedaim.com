import * as React from "react"
import { tx } from "@twind/core"

import { SizesProps } from "../type-utils"

import { useFormControl } from "./form-control"

export interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  disabled?: boolean
  children?: React.ReactNode
  htmlFor?: string
  size?: SizesProps
  bold?: boolean | string
  semibold?: boolean | string
}

export const sizeClasses = {
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
  lg: "text-lg",
  base: "text-base",
  md: "text-base",
  sm: "text-sm",
  xs: "text-xs",
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    const {
      children,
      className,
      size = "xs",
      bold = false,
      semibold = false,
      htmlFor,
      id,
      ...rest
    } = props
    const formControl = useFormControl(rest)

    const classes = tx(
      "text-left align-middle block mb-1.5",
      formControl.disabled && "disabled:opacity-60",
      sizeClasses[size],
      bold ? "font-bold " : "font-medium",
      semibold ? "font-semibold " : "font-medium",
      className,
    )

    return (
      <label
        ref={ref}
        className={classes}
        htmlFor={htmlFor || formControl.id}
        id={id || formControl.labelId}
        {...rest}
      >
        {children}
        {formControl.required && <RequiredIndicator />}
      </label>
    )
  },
)

export const RequiredIndicator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => {
  const { className, ...rest } = props
  const classes = tx("ml-1 text-sm text-red-500 dark:text-red-600", className)

  return (
    <span ref={ref} className={classes} aria-hidden="true" {...rest}>
      *
    </span>
  )
})
