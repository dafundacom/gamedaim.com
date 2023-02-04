import * as React from "react"
import { tx } from "@twind/core"

const DEFAULT_ORIENTATION = "horizontal"
const ORIENTATIONS = ["horizontal", "vertical"] as const

type Orientation = (typeof ORIENTATIONS)[number]

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  as?: React.ElementType
  orientation?: Orientation
  decorative?: boolean
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (props, ref) => {
    const {
      as: Comp = "hr",
      decorative,
      orientation: orientationProp = DEFAULT_ORIENTATION,
      className,
      ...domProps
    } = props

    const orientation = isValidOrientation(orientationProp)
      ? orientationProp
      : DEFAULT_ORIENTATION
    const ariaOrientation = orientation === "vertical" ? orientation : undefined
    const semanticProps = decorative
      ? { role: "none" }
      : { "aria-orientation": ariaOrientation, role: "separator" }
    const classes = tx(
      "border-0 opacity-70 border-[inherit]",
      orientation === "vertical"
        ? "border-l border-solid h-auto mx-2"
        : "border-b border-solid w-auto my-2",
      className,
    )

    return (
      <Comp
        {...semanticProps}
        data-orientation={orientation}
        className={classes}
        {...domProps}
        ref={ref}
      />
    )
  },
)

Divider.propTypes = {
  orientation(props, propName, componentName) {
    const propValue = props[propName]
    const strVal = String(propValue)
    if (propValue && !isValidOrientation(propValue)) {
      return new Error(getInvalidOrientationError(strVal, componentName))
    }
    return null
  },
}

function getInvalidOrientationError(value: string, componentName: string) {
  return `Invalid prop \`orientation\` of value \`${value}\` supplied to \`${componentName}\`, expected one of:
  - horizontal
  - vertical
Defaulting to \`${DEFAULT_ORIENTATION}\`.`
}

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation)
}
