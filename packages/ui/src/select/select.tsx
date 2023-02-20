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
          `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-${colorScheme}-500 dark:focus:border-${colorScheme}-500`,
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
