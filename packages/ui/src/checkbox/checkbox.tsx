import * as React from "react"
import { css, tx } from "@twind/core"

import { useFormControl } from "../form"
import { useForkRef } from "../use-fork-ref"
import { SizesProps } from "../type-utils"

type CheckboxSizes = Exclude<SizesProps, "4xl" | "3xl" | "2xl" | "base" | "xs">

interface ICheckboxProps<T = HTMLInputElement> {
  disabled?: React.InputHTMLAttributes<T>["disabled"]
  invalid?: boolean
  required?: React.InputHTMLAttributes<T>["required"]
  readOnly?: React.InputHTMLAttributes<T>["readOnly"]
  indeterminate?: boolean
  defaultChecked?: boolean
  checked?: boolean
  id?: string
  name?: string
  value?: string | number
  colorScheme?: string
  size?: CheckboxSizes
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-labelledby"?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export type CheckboxProps = ICheckboxProps &
  React.HTMLAttributes<HTMLInputElement>

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
      indeterminate,
      children,
      className,
      ...rest
    } = props

    const { disabled, invalid, readOnly } = useFormControl(props)

    const checkboxLabelSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    }

    const checkboxLabelClasses = tx(
      `ml-2 select-none font-medium text-gray-900 dark:text-gray-300`,
      checkboxLabelSizeClasses[size],
      readOnly || disabled ? "opacity-40" : "opacity-100",
      className,
    )

    const checkboxSizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    }

    const checkboxClasses = tx(
      "cursor-pointer rounded",
      css({
        "accent-color": "currentColor",
      }),
      `text-${colorScheme}-600 bg-gray-100 border-${colorScheme}-300 focus:ring-${colorScheme}-500 dark:focus:ring-${colorScheme}-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`,
      checkboxSizeClasses[size],
      disabled &&
        `disabled:shadow-none disabled:border-${colorScheme}-300 disabled:bg-${colorScheme}-300 disabled:hover:text-${colorScheme}-300 dark:disabled:border-transparent dark:disabled:bg-${colorScheme}-200 dark:disabled:hover:text-${colorScheme}-200`,

      readOnly || disabled ? "opacity-80" : "opacity-100",
      className,
    )

    const ownRef = React.useRef()
    const _ref = useForkRef(ownRef, ref)

    React.useEffect(() => {
      // @ts-ignore
      if (_ref.current) {
        // @ts-ignore
        _ref.current.indeterminate = Boolean(indeterminate)
      }
    }, [indeterminate, _ref])

    return (
      <label
        className={tx(
          "inline-flex cursor-pointer items-center align-top",
          disabled && "cursor-not-allowed",
        )}
      >
        <input
          type="checkbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedby}
          id={id}
          ref={_ref}
          name={name}
          value={value}
          onChange={readOnly ? undefined : onChange}
          defaultChecked={readOnly ? undefined : defaultChecked}
          checked={
            readOnly ? Boolean(checked) : defaultChecked ? undefined : checked
          }
          disabled={disabled}
          aria-disabled={disabled}
          readOnly={readOnly}
          aria-readonly={readOnly}
          aria-invalid={invalid}
          aria-checked={indeterminate ? "mixed" : checked}
          data-color={colorScheme ? colorScheme : undefined}
          className={checkboxClasses}
          {...rest}
        />
        {children && <span className={checkboxLabelClasses}>{children}</span>}
      </label>
    )
  },
)
