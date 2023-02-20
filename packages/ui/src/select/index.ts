import * as React from "react"

import { Select as InternalSelect, SelectProps } from "./select"
import { SelectOption, SelectOptionProps } from "./select-option"

interface Select
  extends React.ForwardRefExoticComponent<
    SelectProps & React.RefAttributes<HTMLElement>
  > {
  Option: typeof SelectOption
}

const Select = InternalSelect as Select
Select.Option = SelectOption

export { Select, SelectOption }
export type { SelectProps, SelectOptionProps }
