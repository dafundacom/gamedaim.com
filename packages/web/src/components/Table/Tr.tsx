import * as React from "react"
import { tx } from "@twind/core"

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isTitle?: boolean
}

export const Tr = React.forwardRef<HTMLTableRowElement, TrProps>(
  (props, ref) => {
    const { className, isTitle = false, ...rest } = props

    const classes = tx(
      "border-b border-gray-50 hover:bg-gray-50",
      isTitle &&
        "rounded-md bg-gray-50 text-sm font-medium uppercase leading-normal text-gray-600",
      className,
    )
    return <tr className={classes} ref={ref} {...rest} />
  },
)
