import * as React from "react"
import { tx } from "@twind/core"

import { useFormControl, IInputProps, InputOmittedType } from "../form"

type TextareaHTMLAttributes<T = HTMLTextAreaElement> = Omit<
  React.TextareaHTMLAttributes<T>,
  InputOmittedType
>

export type TextareaProps<T = HTMLTextAreaElement> = IInputProps<T> &
  TextareaHTMLAttributes<T> &
  React.RefAttributes<T>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      size = "md",
      colorScheme = "gray",
      as: Comp = "textarea",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      className,
      id,
      rows = "4",
      ...rest
    } = props

    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    }

    const classes = tx(
      `block p-2.5 w-full text-gray-900 bg-${colorScheme}-50 rounded-lg border border-gray-300 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-${colorScheme}-500 dark:focus:border-${colorScheme}-500`,
      sizeClasses[size],
      className,
    )

    const { readOnly, disabled, invalid, required, ...formControl } =
      useFormControl(props)

    return (
      <Comp
        ref={ref}
        readOnly={readOnly}
        aria-readonly={readOnly}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        required={required}
        aria-required={required}
        aria-describedby={ariaDescribedby}
        data-color={colorScheme ? colorScheme : undefined}
        className={classes}
        rows={rows}
        id={id || formControl.id}
        {...rest}
      />
    )
  },
)
