import * as React from "react"
import { tx } from "@twind/core"

import { SizesProps } from "../type-utils"

import { textSizeClasses } from "./styles"

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType
  children?: React.ReactNode
  size?: SizesProps
  colorScheme?: string
  lineClamp?: boolean | number
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (props, ref) => {
    const {
      as: Comp = "p",
      colorScheme = "gray",
      className,
      size = "base",
      lineClamp = false,
      ...rest
    } = props

    const classes = tx(
      `leading-normal text-${colorScheme}-900 dark:text-${colorScheme}-100`,
      textSizeClasses[size],
      lineClamp && `line-clamp-${lineClamp}`,
      className,
    )

    return <Comp ref={ref} className={classes} {...rest} />
  },
)
