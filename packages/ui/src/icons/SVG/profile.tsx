import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const ProfileIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
      </svg>
    )
  },
)
