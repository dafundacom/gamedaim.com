import * as React from "react"
import { tx } from "@twind/core"

import { InputProps } from "./input"

type Placement = "left" | "right"

export interface InputElementProps
  extends React.HTMLAttributes<HTMLDivElement> {
  placement?: Placement
  size?: InputProps["size"]
  children?: React.ReactNode
  disabledPointerEvents?: boolean
}

const inputSizes = {
  xs: "h-7 w-7 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-base",
  lg: "h-11 w-11 text-lg",
  xl: "h-[3.125rem] w-[3.125rem] text-xl",
}

export const InputElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  (props, ref) => {
    const {
      size,
      children,
      placement = "left",
      disabledPointerEvents = false,
      className,
      ...rest
    } = props

    const sizeClass = inputSizes[size!]
    const placementProp = { [placement]: "0" }

    const classes = tx(
      "z-10 absolute top-0 flex items-center justify-center",
      sizeClass,
      disabledPointerEvents && "pointer-events-none",
      className,
    )

    return (
      <div ref={ref} className={classes} style={placementProp} {...rest}>
        {children}
      </div>
    )
  },
)

export const InputLeftElement = React.forwardRef<
  HTMLDivElement,
  InputElementProps
>((props, ref) => <InputElement ref={ref} placement="left" {...props} />)

export const InputRightElement = React.forwardRef<
  HTMLDivElement,
  InputElementProps
>((props, ref) => <InputElement ref={ref} placement="right" {...props} />)
