import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const DashboardIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        className={tx(className)}
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        fill={color}
        strokeWidth="0"
        viewBox="0 0 24 24"
        height={height}
        width={width}
        {...rest}
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
      </svg>
    )
  },
)
