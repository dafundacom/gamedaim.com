/* eslint-disable no-unused-vars */
import * as React from "react"
import { tx } from "@twind/core"
import { getValidChildren } from "../children-utils"
import { RadioProps } from "./radio"

export interface RadioGroupProps {
  className?: string
  id?: string
  name?: string
  children?: React.ReactNode
  defaultValue?: RadioProps["value"]
  value?: RadioProps["value"]
  size?: RadioProps["size"]
  colorScheme?: RadioProps["color"]
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: RadioProps["value"],
  ) => void
  inline?: boolean
}

type RadioGroupElement =
  | {
      focus: () => void
    }
  | undefined

export const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>(
  (props, ref) => {
    const {
      className,
      onChange,
      name,
      colorScheme = "gray",
      size,
      defaultValue,
      inline,
      value: valueProp,
      children,
      ...rest
    } = props

    const { current: isControlled } = React.useRef(valueProp != null)
    const [value, setValue] = React.useState(defaultValue || null)
    const _value = isControlled ? valueProp : value

    const rootRef = React.useRef<HTMLDivElement>(null)

    const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setValue(event.target.value)
      }

      if (onChange) {
        onChange(event, event.target.value)
      }
    }

    const fallbackName = `radio-${React.useId()}`
    const _name = name || fallbackName

    const validChildren = getValidChildren(children)

    const classes = tx(inline ? "inline-block" : "block", className)

    const clones = validChildren.map((child: any, index: number) => {
      return (
        <div key={index} className={classes}>
          {React.cloneElement(child, {
            size: child.props.size || size,
            colorScheme: child.props.colorScheme || colorScheme,
            name: _name,
            onChange: _onChange,
            checked: child.props.value === _value,
          })}
        </div>
      )
    })

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          let input: HTMLInputElement | null =
            rootRef.current?.querySelector("input:not(:disabled):checked") ||
            null

          if (!input) {
            input =
              rootRef.current?.querySelector("input:not(:disabled)") || null
          }

          if (input) {
            input.focus()
          }
        },
      }),
      [],
    )

    return (
      <div ref={rootRef} role="radiogroup" {...rest}>
        {clones}
      </div>
    )
  },
)
