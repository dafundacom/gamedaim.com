import * as React from "react"

export interface SelectOptionProps
  extends React.HTMLAttributes<HTMLOptionElement> {
  value?: string
}

export const SelectOption = React.forwardRef<
  HTMLOptionElement,
  SelectOptionProps
>((props, ref) => {
  const { children, value, ...rest } = props

  return (
    <option value={value} ref={ref} {...rest}>
      {children}
    </option>
  )
})
