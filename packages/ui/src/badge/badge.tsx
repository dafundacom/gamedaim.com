import * as React from "react"
import { tx } from "@twind/core"
import { SizesProps, VariantProps } from "../type-utils"

export type BadgeSizes = Exclude<
  SizesProps,
  "4xl" | "3xl" | "2xl" | "xl" | "lg" | "base" | "xs"
>

export type BadgeVariant = Exclude<VariantProps, "ghost">

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType
  colorScheme?: string
  variant?: BadgeVariant
  size?: BadgeSizes
  hasShadow?: boolean
  // icon?: string | React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (props, ref) => {
    const {
      as: Comp = "span",
      colorScheme = "gray",
      variant = "solid",
      className,
      size = "md",
      hasShadow = false,
      // icon,
      children,
      ...rest
    } = props

    const sizeClasses = {
      sm: "text-xs font-medium px-2.5 py-0.5",
      md: "text-sm font-semibold px-2.5 py-0.5",
    }

    const variantClasses = {
      solid: `bg-${colorScheme}-100 text-${colorScheme}-800 dark:bg-${colorScheme}-700 dark:text-${colorScheme}-300`,
      outline: `bg-transparent text-${colorScheme}-800 border border-${colorScheme}-600 dark:border-${colorScheme}-600 dark:text-${colorScheme}-300`,
    }

    const classes = tx(
      "mr-2 inline-flex items-center rounded leading-4",
      variantClasses[variant],
      sizeClasses[size],
      hasShadow && `ring-2 ring-white dark:ring-black`,
      className,
    )

    return (
      <Comp
        ref={ref}
        className={classes}
        data-color={colorScheme ? colorScheme : undefined}
        {...rest}
      >
        {/* {icon ? icon : null} */}
        {children}
      </Comp>
    )
  },
)
