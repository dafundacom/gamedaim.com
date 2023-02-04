import * as React from "react"
import { tx } from "@twind/core"
import { ImSpinner5 } from "react-icons/im"

interface RedirectProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  colorScheme?: string
}

export const RedirectProgress = React.forwardRef<
  HTMLDivElement,
  RedirectProgressProps
>((props, ref) => {
  const { colorScheme = "gray", className, ...rest } = props

  return (
    <div
      ref={ref}
      className={tx(
        `flex min-h-screen flex-col items-center justify-center text-${colorScheme}-800`,
        className,
      )}
      {...rest}
    >
      <ImSpinner5 className="mb-4 animate-spin text-6xl" />
    </div>
  )
})
