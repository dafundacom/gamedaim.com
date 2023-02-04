import * as React from "react"
import { tx } from "@twind/core"

import { Icon, CrossIcon } from "../icons"
import { SizesProps, VariantProps } from "../type-utils"

export interface TagCloseButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  iconClassName?: string
}

export const TagCloseButton = React.forwardRef<
  HTMLButtonElement,
  TagCloseButtonProps
>((props, ref) => {
  const { disabled, className, iconClassName, ...rest } = props
  return (
    <>
      <button
        ref={ref}
        className={tx(
          "ml-1 -mr-1 flex cursor-pointer items-center justify-center rounded-full opacity-50 outline-none transition-all duration-150 hover:opacity-80 focus:outline-none active:opacity-100",
          className,
        )}
        disabled={disabled}
        aria-disabled={disabled}
        {...rest}
      >
        <Icon
          as={CrossIcon}
          label="x"
          className={tx("h-3.5 w-3.5", iconClassName)}
        />
      </button>
    </>
  )
})

export interface TagLabelProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TagLabel: React.FunctionComponent<TagLabelProps> = (props) => {
  const { className, ...rest } = props

  return <span className={tx(className)} {...rest} />
}

type TagSizes = Exclude<SizesProps, "4xl" | "3xl" | "2xl" | "base" | "xs">

type TagVariant = Exclude<VariantProps, "ghost">

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  colorScheme?: string
  variant?: TagVariant
  size?: TagSizes
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>((props, ref) => {
  const {
    as: Comp = "div",
    variant = "solid",
    size = "md",
    colorScheme = "gray",
    className,
    ...rest
  } = props

  const variantClasses = {
    solid: `border bg-${colorScheme}-500 border-transparent text-white dark:border-${colorScheme}-600 dark:text-${colorScheme}-100 dark:bg-${colorScheme}-700`,
    outline: `border bg-transparent border-${colorScheme}-200 text-${colorScheme}-900 dark:border-${colorScheme}-600/40 dark:text-${colorScheme}-100`,
  }

  const sizeClasses = {
    sm: "px-2 h-5 text-xs min-w-[1.25rem]",
    md: "px-2 h-6 text-xs min-w-[1.5rem]",
    lg: "px-2.5 h-7 text-sm min-w-[1.75rem]",
    xl: "px-3 h-7 text-base min-w-[2rem]",
  }

  const classes = tx(
    "inline-flex items-center max-h-full rounded-full font-medium outline-none cursor-pointer whitespace-nowrap",
    sizeClasses[size],
    variantClasses[variant],
    className,
  )

  return (
    <Comp
      ref={ref}
      data-color={colorScheme ? colorScheme : undefined}
      className={classes}
      {...rest}
    />
  )
})
