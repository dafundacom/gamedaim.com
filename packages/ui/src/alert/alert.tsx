import * as React from "react"
import { tx } from "@twind/core"

import { CrossIcon, Icon } from "../icons"

interface AlertContextProps {
  colorScheme?: string
}

const AlertContext = React.createContext<AlertContextProps>({})

const useAlertContext = () => {
  const context = React.useContext(AlertContext)
  if (context === undefined) {
    throw new Error(
      "useAlertContext must be used within a AlertContextProvider",
    )
  }
  return context
}

export interface AlertCloseButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const AlertCloseButton = React.forwardRef<
  HTMLButtonElement,
  AlertCloseButtonProps
>(({ className }, ref) => {
  const { colorScheme } = useAlertContext()

  const classes = tx(
    `absolute right-4 cursor-pointer focus:outline-none text-gray-600 hover:text-gray-700 dark:text-${colorScheme}-300 dark:hover:text-${colorScheme}-400`,
    className,
  )

  return (
    <button
      ref={ref}
      data-color={colorScheme ? colorScheme : undefined}
      className={classes}
    >
      <Icon
        as={CrossIcon}
        label="x"
        className="inline-block h-4 w-4 fill-current align-text-bottom text-current"
      />
    </button>
  )
})

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  colorScheme?: string
  variant?: "solid" | "top-accent" | "left-accent"
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, ref) => {
    const {
      as: Comp = "div",
      colorScheme = "gray",
      variant = "subtle",
      className,
      ...rest
    } = props

    const variantClasses = {
      subtle: `rounded-md text-gray-900 bg-${colorScheme}-500 dark:text-${colorScheme}-300 dark:bg-${colorScheme}-500/10`,
      solid: `mb-4 rounded-lg p-4 text-sm text-${colorScheme}-700 bg-${colorScheme}-100 rounded-lg dark:bg-${colorScheme}-200 dark:text-${colorScheme}-800`,
      "left-accent": `border-l-4 rounded-sm text-${colorScheme}-700 bg-transparent border-${colorScheme}-500 dark:bg-${colorScheme}-200`,
      "top-accent": `mb-4 p-4 flex border-t-4  border-${colorScheme}-500 text-${colorScheme}-700 bg-${colorScheme}-100 dark:bg-${colorScheme}-200`,
    }

    const classes = tx(
      "flex w-full items-center px-4 py-3 relative overflow-hidden",
      variantClasses[variant],
      className,
    )

    const context = { colorScheme }

    return (
      <AlertContext.Provider value={context}>
        <Comp
          role="alert"
          ref={ref}
          data-color={colorScheme ? colorScheme : undefined}
          className={classes}
          {...rest}
        />
      </AlertContext.Provider>
    )
  },
)
