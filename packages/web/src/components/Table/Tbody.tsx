import * as React from "react"
import { tx } from "@twind/core"

interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Tbody = React.forwardRef<HTMLTableSectionElement, TbodyProps>(
  (props, ref) => {
    const { className, ...rest } = props

    const classes = tx("text-sm font-light text-gray-600", className)
    return <tbody className={classes} ref={ref} {...rest} />
  },
)
