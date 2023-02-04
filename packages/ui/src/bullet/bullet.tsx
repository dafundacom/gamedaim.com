import * as React from "react"
import { tx } from "@twind/core"

import { SizesProps } from "../type-utils"

type BulletSizes = Exclude<SizesProps, "4xl" | "base">

export interface BulletProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType
  colorScheme?: string
  variant?: "outline" | "solid"
  size?: BulletSizes | "3xs" | "2xs"
  bordered?: boolean
}

export const Bullet = React.forwardRef<HTMLSpanElement, BulletProps>(
  (props, ref) => {
    const {
      as: Comp = "span",
      colorScheme = "gray",
      variant = "solid",
      className,
      size = "2xs",
      bordered = false,
      ...rest
    } = props

    const variantClasses = {
      solid: `bg-${colorScheme}-500`,
      outline: `bg-white border-2 border-${colorScheme}-500 dark:bg-${colorScheme}-800`,
    }

    const sizeClasses = {
      "3xs": "h-1.5 w-1.5",
      "2xs": "h-2 w-2",
      xs: "h-2.5 w-2.5",
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
      xl: "h-5 w-5",
      "2xl": "h-6 w-6",
      "3xl": "h-8 w-8",
    }

    const classes = tx(
      "inline-flex relative rounded-full",
      bordered && "border-2 border-white dark:border-secondary-800",
      sizeClasses[size],
      variantClasses[variant],
      className,
    )

    return (
      <Comp
        ref={ref}
        className={classes}
        data-color={colorScheme ? colorScheme : undefined}
        {...rest}
      />
    )
  },
)
