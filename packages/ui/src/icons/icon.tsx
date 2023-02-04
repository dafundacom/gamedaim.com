import * as React from "react"
import { tx } from "@twind/core"
import { VisuallyHidden } from "../visually-hidden"

import { QuestionCircleIcon } from "./SVG/question-circle"

export interface IconProps {
  as?: React.ElementType
  inline?: boolean
  role?: string
  color?: string
  height?: string
  width?: string
  label?: string
  className?: string
}

export const Icon = React.forwardRef<any, IconProps>((props, ref) => {
  const {
    as: Comp = QuestionCircleIcon,
    width,
    height,
    inline = true,
    className,
    role = "presentation",
    label,
    ...rest
  } = props

  const classes = tx(
    "text-black dark:text-gray-100",
    inline ? "inline-block align-middle" : "block",
    className,
  )

  return (
    <>
      <Comp
        ref={ref}
        height={height}
        width={width}
        className={classes}
        role={role}
        aria-hidden={true}
        focusable={false}
        {...rest}
      />
      <VisuallyHidden>{label}</VisuallyHidden>
    </>
  )
})
