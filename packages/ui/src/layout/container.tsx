import * as React from "react"
import { tx } from "@twind/core"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { className, children, ...rest } = props

    const classes = tx("container mx-auto py-4", className)

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    )
  },
)
