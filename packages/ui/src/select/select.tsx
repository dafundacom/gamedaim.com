import * as React from "react"
import { tx } from "@twind/core"

export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  id?: string
  colorScheme?: string
  className?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const { children, id, className, colorScheme = "blue", ...rest } = props

    return (
      <select
        id={id}
        className={tx(
          `rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 block w-full p-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-${colorScheme}-500 dark:focus:border-${colorScheme}-500`,
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
    )
  },
)
