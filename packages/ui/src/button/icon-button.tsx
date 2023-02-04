import * as React from "react"

import { Button, ButtonProps } from "./button"

type OmittedProps = "leftIcon" | "rightIcon" | "loadingText"

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    Omit<ButtonProps, OmittedProps> {
  icon?: React.ReactElement
  "aria-label"?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { icon, children, "aria-label": ariaLabel, ...rest } = props

    const element = icon || children
    const _children = React.isValidElement(element)
      ? React.cloneElement(element as any, {})
      : null

    return (
      <Button ref={ref} aria-label={ariaLabel} {...rest}>
        {_children}
      </Button>
    )
  },
)
