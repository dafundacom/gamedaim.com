import * as React from "react"
import { tx } from "@twind/core"

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isTitle?: boolean
}

export const Tr = React.forwardRef<HTMLTableRowElement, TrProps>(
  (props, ref) => {
    const { className, isTitle = false, ...rest } = props

    const classes = tx(
      "border-b border-gray-50 hover:bg-gray-50 dark:hover:bg-gray-600",
      isTitle &&
        "rounded-md bg-gray-50 dark:bg-gray-900 text-sm font-medium uppercase leading-normal text-gray-600 dark:text-gray-200",
      className,
    )
    return <tr className={classes} ref={ref} {...rest} />
  },
)
