import * as React from "react"

import {
  Input as InternalInput,
  IInputProps,
  InputProps,
  InputOmittedType,
} from "./input"
import { InputGroup, InputGroupProps } from "./input-group"
import { InputLeftAddon, InputRightAddon, InputAddonProps } from "./input-addon"
import {
  InputLeftElement,
  InputRightElement,
  InputElementProps,
} from "./input-element"

interface Input
  extends React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLElement>
  > {
  Group: typeof InputGroup

  LeftAddon: typeof InputLeftAddon
  RightAddon: typeof InputRightAddon

  LeftElement: typeof InputLeftElement
  RightElement: typeof InputRightElement
}

const Input = InternalInput as Input

Input.Group = InputGroup
Input.LeftAddon = InputLeftAddon
Input.RightAddon = InputRightAddon
Input.LeftElement = InputLeftElement
Input.RightElement = InputRightElement

export { Input }
export type {
  IInputProps,
  InputProps,
  InputGroupProps,
  InputAddonProps,
  InputElementProps,
  InputOmittedType,
}

export * from "./form-control"
export * from "./form-error-message"
export * from "./form-helper-text"
export * from "./form-label"
