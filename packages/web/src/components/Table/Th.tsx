import * as React from "react"
import { tx } from "@twind/core"

export interface ThProps extends React.HTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "right" | "center"
}

export const Th = React.forwardRef<HTMLTableCellElement, ThProps>(
  (props, ref) => {
    const { className, align = "left", ...rest } = props

    const classes = tx(
      "py-3 px-6",
      align === "left" && "text-left",
      align === "right" && "text-right",
      align === "center" && "text-center",
      className,
    )
    return <th className={classes} ref={ref} {...rest} />
  },
)
