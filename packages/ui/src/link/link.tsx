import * as React from "react"
import { tx } from "@twind/core"

export interface LinkProps {
  className?: string
  disabled?: boolean
  external?: boolean
  as?: React.ElementType
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  colorScheme?: string
  children?: React.ReactNode
  variant?: "styled" | "unstyled"
}

// FIX: this with use the right interface / type
export const Link = React.forwardRef<unknown, any>((props, ref) => {
  const {
    disabled,
    external,
    onClick,
    colorScheme = "gray",
    className,
    variant = "unstyled",
    as: Comp = "a",
    ...rest
  } = props

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : null

  const classes = tx(
    `text-${colorScheme}-500 dark:text-${colorScheme}-400 focus:ring-${colorScheme}-500 cursor-pointer cursor-pointer no-underline outline-none hover:underline focus:ring-2`,
    disabled &&
      "disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60",
    className,
  )

  const unstyledClasses = tx(className)

  return (
    <Comp
      ref={ref}
      tabIndex={disabled ? -1 : undefined}
      data-color={variant === "styled" && colorScheme ? colorScheme : undefined}
      aria-disabled={disabled}
      onClick={disabled ? (event: any) => event.preventDefault() : onClick}
      className={variant === "styled" ? classes : unstyledClasses}
      {...externalProps}
      {...rest}
    />
  )
})
