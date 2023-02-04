import * as React from "react"
import { tx } from "@twind/core"
import { getValidChildren } from "../children-utils"

import { CheckboxProps } from "./checkbox"

export interface CheckboxGroupProps {
  className?: string
  id?: CheckboxProps["id"]
  name?: CheckboxProps["name"]
  children?: React.ReactNode
  defaultValue?: Array<CheckboxProps["value"]>
  value?: Array<CheckboxProps["value"]>
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: Array<CheckboxProps["value"]>) => void
  inline?: boolean
  size?: CheckboxProps["size"]
  colorScheme?: CheckboxProps["color"]
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>((props, ref) => {
  const {
    className,
    onChange,
    name,
    colorScheme,
    size,
    defaultValue,
    inline,
    value: valueProp,
    children,
    ...rest
  } = props
  const [values, setValues] = React.useState(defaultValue || [])

  const { current: isControlled } = React.useRef(valueProp != null)
  const _values = isControlled ? valueProp : values

  const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target
    let newValues: any
    if (checked) {
      newValues = [...(_values || []), value]
    } else {
      newValues = (_values || []).filter((val) => val !== value)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isControlled && setValues(newValues)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(newValues)
  }

  const fallbackName = `checkbox-${React.useId()}`
  const _name = name || fallbackName

  const validChildren = getValidChildren(children)

  const clones = validChildren.map((child, index) => {
    return (
      <div
        key={index}
        className={tx(
          inline ? "inline-block" : "block",
          child.props.className,
          className,
        )}
      >
        {React.cloneElement(child, {
          size: size,
          colorScheme: child.props.colorScheme || colorScheme,
          name: `${_name}-${index}`,
          onChange: _onChange,
          checked: (_values || []).includes(child.props.value),
        })}
      </div>
    )
  })

  return (
    <div role="group" ref={ref} {...rest}>
      {clones}
    </div>
  )
})
