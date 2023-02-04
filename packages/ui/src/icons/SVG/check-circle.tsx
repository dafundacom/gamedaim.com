import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const CheckCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const { color = "currentColor", width, height, className, ...rest } = props

    return (
      <svg
        ref={ref}
        className={tx(className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke={color}
        height={height}
        width={width}
        {...rest}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  },
)
