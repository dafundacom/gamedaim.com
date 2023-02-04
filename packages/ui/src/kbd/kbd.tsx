import * as React from "react"
import { tx } from "@twind/core"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  colorScheme?: string
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>((props, ref) => {
  const { colorScheme = "gray", className, ...rest } = props

  const classes = tx(
    `min-w-[1.25rem] bg-${colorScheme}-100 text-${colorScheme}-900 dark:bg-${colorScheme}-300 dark:text-${colorScheme}-300 inline-flex h-5 justify-center whitespace-nowrap rounded p-1 font-sans text-xs capitalize`,
    className,
  )
  return <kbd ref={ref} className={classes} {...rest} />
})
