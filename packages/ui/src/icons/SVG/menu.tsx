import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const MenuIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const {
      color = "currentColor",
      width = "1em",
      height = "1em",
      className,
      ...rest
    } = props

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        className={tx(className)}
        stroke={color}
        fill={color}
        strokeWidth="0"
        viewBox="0 0 24 24"
        height={height}
        width={width}
        {...rest}
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M2 15.5v2h20v-2H2zm0-5v2h20v-2H2zm0-5v2h20v-2H2z"></path>
      </svg>
    )
  },
)
