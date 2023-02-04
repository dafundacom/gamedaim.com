import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const CrossCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  },
)
