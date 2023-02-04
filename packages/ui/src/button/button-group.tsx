import * as React from "react"
import { tx } from "@twind/core"
import { getValidChildren } from "../children-utils"

import { ButtonProps } from "./button"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  colorScheme?: ButtonProps["colorScheme"]
  children?: React.ReactNode
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (props, ref) => {
    const {
      size,
      colorScheme,
      variant,
      disabled,
      children,
      className,
      ...rest
    } = props

    const validChildren = getValidChildren(children)
    const clones = validChildren.map((child) => {
      return React.cloneElement(child, {
        size: size || child.props.size,
        colorScheme: child.props.colorScheme || colorScheme,
        variant: child.props.variant || variant,
        disabled: child.props.disabled || disabled,
      })
    })

    return (
      <div
        ref={ref}
        role="group"
        className={tx("inline-block", className)}
        {...rest}
      >
        {clones}
      </div>
    )
  },
)
