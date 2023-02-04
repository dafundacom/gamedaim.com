import * as React from "react"
import { tx } from "@twind/core"
import { SpinnerIcon } from "../icons"
import { SizesProps, VariantProps } from "../type-utils"

export type ButtonSizes = Exclude<SizesProps, "4xl" | "3xl" | "2xl" | "base">

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType
  loading?: boolean
  disabled?: boolean
  active?: boolean
  loadingText?: string
  type?: "button" | "reset" | "submit"
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  colorScheme?: string
  size?: ButtonSizes
  variant?: VariantProps | "link"
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      as: Comp = "button",
      disabled: _disabled,
      loading,
      active,
      loadingText,
      type,
      leftIcon,
      rightIcon,
      children,
      className,
      colorScheme = "gray",
      variant = "solid",
      size = "md",
      ...rest
    } = props

    const disabled = _disabled || loading

    const variantClasses = {
      outline: `shadow-sm text-${colorScheme}-700 hover:text-white border border-${colorScheme}-700 hover:bg-${colorScheme}-800 focus:ring-4 focus:ring-${colorScheme}-300  dark:border-${colorScheme}-500 dark:text-${colorScheme}-500 dark:hover:text-white dark:hover:bg-${colorScheme}-600 dark:focus:ring-${colorScheme}-800`,
      solid: `shadow-sm text-white bg-${colorScheme}-700 hover:bg-${colorScheme}-800 focus:ring-4 focus:ring-${colorScheme}-300 dark:bg-${colorScheme}-600 dark:hover:bg-${colorScheme}-700 dark:focus:ring-${colorScheme}-800`,
      ghost: `text-${colorScheme}-900 bg-transparent hover:bg-${colorScheme}-100 dark:bg-transparent dark:text-${colorScheme}-50 dark:hover:border-${colorScheme}-300 dark:hover:bg-${colorScheme}-700 dark:active:bg-${colorScheme}-600 dark:active:border-${colorScheme}-400 focus:ring-4 focus:ring-${colorScheme}-300 dark:focus:ring-${colorScheme}-800`,
      link: `h-auto p-0 leading-normal text-${colorScheme}-600 hover:underline active:text-${colorScheme}-700 dark:text-${colorScheme}-200 dark:active:text-${colorScheme}-600`,
    }

    const sizeClasses = {
      xs: "px-3 h-7 text-xs min-w-[1.75rem]",
      sm: "h-8 px-3.5 text-sm min-w-[2rem]",
      md: "h-9 px-4 text-base min-w-[2.5rem]",
      lg: "h-11 px-5 text-lg min-w-[2.75rem]",
      xl: "h-[3rem] px-6 text-xl min-w-[3rem]",
    }

    const classes = tx(
      "inline-flex flex-shrink-0 relative items-center justify-center align-middle rounded-md m-0 font-medium leading-tight transition-colors duration-75 ease-out outline-none appearance-none cursor-pointer focus:outline-none select-none whitespace-nowrap",
      sizeClasses[size],
      variantClasses[variant],
      disabled &&
        "disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )

    return (
      <Comp
        role="button"
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled}
        type={type}
        data-active={active ? "true" : undefined}
        data-color={colorScheme ? colorScheme : undefined}
        className={classes}
        {...rest}
      >
        {leftIcon && !loading ? leftIcon : null}
        {loading && (
          <SpinnerIcon
            className={tx(
              loadingText ? "relative" : "absolute",
              loadingText ? `mr-2` : "mr-0",
            )}
            size="sm"
          />
        )}
        {loading
          ? loadingText || <span className="opacity-0">{children}</span>
          : children}
        {rightIcon && !loading ? rightIcon : null}
      </Comp>
    )
  },
)
