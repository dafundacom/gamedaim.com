import * as React from "react"
import { tx } from "@twind/core"
import { useFormControl } from "../form"
import type { SizesProps } from "../type-utils"

type RadioSizes = Exclude<SizesProps, "4xl" | "3xl" | "2xl" | "base" | "xs">

export interface RadioProps<T = HTMLInputElement>
  extends React.HTMLAttributes<HTMLInputElement> {
  disabled?: React.InputHTMLAttributes<T>["disabled"]
  invalid?: boolean
  required?: React.InputHTMLAttributes<T>["required"]
  readOnly?: React.InputHTMLAttributes<T>["readOnly"]
  defaultChecked?: boolean
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  id?: string
  name?: string
  value?: string | number
  size?: RadioSizes
  colorScheme?: string
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-labelledby"?: string
  children?: React.ReactNode
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) => {
    const {
      id,
      name,
      value,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedby,
      colorScheme = "gray",
      defaultChecked,
      checked,
      size = "md",
      onChange,
      children,
      className,
      ...rest
    } = props

    const { disabled } = useFormControl(props)

    const radioLabelSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    }

    const radioSizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    }

    const radioClasses = tx(
      `cursor-pointer shadow-sm bg-[currentColor] border-${colorScheme}-300 text-${colorScheme}-600 hover:text-${colorScheme}-100 invalid:border-1 invalid:border-red-500 invalid:hover:border-1 invalid:hover:border-red-700 dark:border-${colorScheme}-600 dark:text-${colorScheme}-700 dark:hover:border-${colorScheme}-300 dark:hover:text-${colorScheme}-600 dark:invalid:border-1 dark:invalid:border-red-700 dark:invalid:hover:border-1 dark:invalid:hover:border-red-800 checked:border-transparent dark:focus:ring-offset-${colorScheme}-900`,
      radioSizeClasses[size],
      disabled ? "opacity-80" : "opacity-100",
      disabled &&
        `disabled:shadow-none disabled:border-${colorScheme}-300 disabled:bg-${colorScheme}-300 disabled:hover:text-${colorScheme}-300 dark:disabled:border-transparent dark:disabled:bg-${colorScheme}-200 dark:disabled:hover:text-${colorScheme}-600`,
      className,
    )

    const radioLabelClasses = tx(
      `ml-2 select-none text-sm text-${colorScheme}-900 dark:text-${colorScheme}-100`,
      radioLabelSizeClasses[size],
      disabled ? "opacity-40" : "opacity-100",
      className,
    )

    return (
      <label
        className={tx(
          "inline-flex items-center align-top",
          disabled && "cursor-not-allowed",
        )}
      >
        <input
          type="radio"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedby}
          id={id}
          ref={ref}
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
          aria-disabled={disabled}
          data-color={colorScheme ? colorScheme : undefined}
          className={radioClasses}
          {...rest}
        />
        {children && <span className={radioLabelClasses}>{children}</span>}
      </label>
    )
  },
)
