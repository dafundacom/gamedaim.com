import * as React from "react"
import { tx } from "@twind/core"
import { SizesProps } from "../../type-utils"

export type SpinnerIconSizes = Exclude<
  SizesProps,
  "4xl" | "3xl" | "2xl" | "base"
>

export interface SpinnerIconProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: SpinnerIconSizes
}

export const SpinnerIcon = React.forwardRef<SVGSVGElement, SpinnerIconProps>(
  (props, ref) => {
    const { size = "sm", className, ...rest } = props

    const sizeClasses = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    }

    const classes = tx("animate-spin", sizeClasses[size], className)

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        className={classes}
        fill="none"
        viewBox="0 0 66 66"
        {...rest}
      >
        <circle
          cx="33"
          cy="33"
          fill="none"
          r="28"
          stroke="currentColor"
          strokeWidth="10"
          className={tx("opacity-30")}
        />
        <circle
          cx="33"
          cy="33"
          fill="none"
          r="28"
          stroke="currentColor"
          strokeDasharray="40, 134"
          strokeDashoffset="325"
          strokeLinecap="round"
          strokeWidth="10"
          className={tx("opacity-70")}
        />
      </svg>
    )
  },
)
