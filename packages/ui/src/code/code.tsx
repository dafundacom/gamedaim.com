import * as React from "react"
import { tx } from "@twind/core"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  colorScheme?: string
}

export const Code = React.forwardRef<HTMLElement, CodeProps>((props, ref) => {
  const { as: Comp = "code", colorScheme = "gray", className, ...rest } = props
  return (
    <Comp
      ref={ref}
      data-colorScheme={colorScheme ? colorScheme : undefined}
      className={tx`bg-${colorScheme}-200 border-${colorScheme}-100 text-${colorScheme}-900 dark:bg-${colorScheme}-700 dark:border-${colorScheme}-600 dark:text-${colorScheme}-300 inline-flex items-center justify-center break-all rounded-sm border px-px py-[3px] font-mono text-xs ${className}`}
      {...rest}
    />
  )
})
