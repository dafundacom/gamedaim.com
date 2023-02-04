import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const InfoIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const { color = "currentColor", width, height, className, ...rest } = props

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        className={tx(className)}
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  },
)
