import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const LoginIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path d="m13 16 5-4-5-4v3H4v2h9z" />
        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
      </svg>
    )
  },
)
