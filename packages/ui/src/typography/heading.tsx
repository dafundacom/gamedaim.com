import * as React from "react"
import { tx } from "@twind/core"

import { SizesProps } from "../type-utils"
import { textSizeClasses } from "./styles"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType
  children?: React.ReactNode
  size?: SizesProps
  bold?: boolean | string
  medium?: boolean | string
  colorScheme?: string
  lineClamp?: number
  semibold?: boolean
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    const {
      as: Comp = "h1",
      colorScheme = "gray",
      className,
      size = "xl",
      semibold = true,
      bold = false,
      medium = false,
      children,
      lineClamp = 2,
      ...rest
    } = props
    const classes = tx(
      `leading-normal text-${colorScheme}-900 dark:text-${colorScheme}-100 line-clamp-${lineClamp}`,
      bold && "font-bold",
      medium && "font-medium",
      semibold && "font-semibold",
      textSizeClasses[size],
      className,
    )

    return (
      <Comp ref={ref} className={classes} {...rest}>
        {children}
      </Comp>
    )
  },
)
