import * as React from "react"
import { tx } from "@twind/core"

import { InputProps } from "./input"

type Placement = "left" | "right"

export interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: Placement
  size?: InputProps["size"]
  colorScheme?: string
}

const _placement = {
  left: "-mr-1 rounded-r-none",
  right: "-ml-1 rounded-l-none",
}

const sizeClasses = {
  xs: "px-2 text-xs",
  sm: "px-3 text-xs",
  md: "px-4 text-sm",
  lg: "px-4 text-base",
  xl: "px-6 text-lg",
}

export const InputAddon: React.FunctionComponent<InputAddonProps> = (props) => {
  const {
    placement = "left",
    size = "md",
    colorScheme = "gray",
    className,
    ...rest
  } = props

  const classes = tx(
    `flex items-center w-auto rounded-md shadow-sm whitespace-nowrap border border-${colorScheme}-300 text-${colorScheme}-600 bg-${colorScheme}-50 dark:border-${colorScheme}-700 dark:text-${colorScheme}-100 dark:bg-${colorScheme}-300`,
    sizeClasses[size],
    _placement[placement],
    className,
  )

  return <div className={classes} {...rest} />
}

export const InputLeftAddon: React.FunctionComponent<InputAddonProps> = (
  props,
) => <InputAddon placement="left" {...props} />

export const InputRightAddon: React.FunctionComponent<InputAddonProps> = (
  props,
) => <InputAddon placement="right" {...props} />
