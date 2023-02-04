import * as React from "react"

import { tx } from "@twind/core"

export interface VisuallyHiddenProps {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const VisuallyHidden = React.forwardRef<any, any>((props, ref) => {
  const { as: Comp = "span", className, style = {}, ...rest } = props
  return (
    <Comp
      ref={ref}
      style={{
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...style,
      }}
      className={tx`${className}`}
      {...rest}
    />
  )
})
