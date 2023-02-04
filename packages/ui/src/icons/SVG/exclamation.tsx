import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const ExclamationIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    )
  },
)
