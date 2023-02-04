// WARN: NOTWORK because now twind not yet support tailwind accent color
import * as React from "react"
import { tx } from "@twind/core"
import { useFormControl } from "../form"
import { VisuallyHidden } from "../visually-hidden"

export interface SwitchProps<T = HTMLInputElement> {
  className?: string
  disabled?: React.InputHTMLAttributes<T>["disabled"]
  invalid?: boolean
  defaultChecked?: boolean
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  id?: string
  name?: string
  value?: string | number
  size?: "sm" | "md"
  colorScheme?: string
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-labelledby"?: string
  children?: React.ReactNode
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const {
      id,
      name,
      value,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      colorScheme = "blue",
      defaultChecked,
      checked,
      size = "md",
      onChange,
      className,
      ...rest
    } = props

    const { disabled, invalid } = useFormControl(props)

    const sizeClasses = {
      sm: "h-4 w-7 after:h-3 after:w-3",
      md: "h-6 w-11 after:h-5 after:w-5",
    }

    const classes = tx(
      `bg-gray-200 rounded-full accent-${colorScheme}-500 peer peer-focus:ring-4 peer-focus:ring-${colorScheme}-300 dark:peer-focus:ring-${colorScheme}-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full  after:transition-all dark:border-gray-600 peer-checked:bg-${colorScheme}-600`,
      sizeClasses[size],
      disabled && "opacity-60 cursor-not-allowed",
      className,
    )

    return (
      <label
        className={tx("relative mb-4 inline-flex cursor-pointer items-center")}
        {...rest}
      >
        <input
          type="checkbox"
          value=""
          id="default-toggle"
          className={tx("peer sr-only")}
        />
        <VisuallyHidden
          as="input"
          type="checkbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          id={id}
          ref={ref}
          name={name}
          value={value}
          aria-invalid={invalid}
          defaultChecked={defaultChecked}
          onChange={onChange}
          checked={checked}
          data-disabled={disabled}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={classes}
          data-disabled={disabled}
          data-color={colorScheme ? colorScheme : undefined}
        ></div>
      </label>
    )
  },
)
