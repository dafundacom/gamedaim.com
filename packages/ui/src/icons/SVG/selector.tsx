import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const SelectorIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    )
  },
)
