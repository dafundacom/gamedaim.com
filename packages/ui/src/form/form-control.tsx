import * as React from "react"
import { tx } from "@twind/core"

interface UseFormControlProps {
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  readOnly?: boolean
  id?: string
}

interface UseFormControlData extends UseFormControlProps {
  labelId?: string
  errorId?: string
  helpTextId?: string
}

export interface FormControlProps
  extends UseFormControlProps,
    React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

interface FormControlContextProps extends UseFormControlProps {}

export const useFormControl = (
  props: UseFormControlProps,
): UseFormControlData => {
  const context = useFormControlContext()
  if (!context) {
    return props
  }
  const keys = Object.keys(context)
  return keys.reduce((acc, prop) => {
    acc[prop] = props[prop]
    if (context) {
      if (props[prop] == null) {
        acc[prop] = context[prop]
      }
    }

    return acc
  }, {})
}

const FormControlContext = React.createContext<
  FormControlContextProps | undefined
>(undefined)

const useFormControlContext = () => React.useContext(FormControlContext)

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    const {
      children,
      className,
      required,
      disabled,
      invalid,
      readOnly,
      id: idProp,
      ...rest
    } = props

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = idProp || `field-${React.useId()}`

    const labelId = `${id}-label`
    const errorId = `${id}-error`
    const helpTextId = `${id}-helptext`

    const context = {
      required,
      disabled,
      invalid,
      readOnly,
      id,
      labelId,
      errorId,
      helpTextId,
    }

    const classes = tx("relative w-full", className)

    return (
      <FormControlContext.Provider value={context}>
        <div role="group" ref={ref} className={classes} {...rest}>
          {children}
        </div>
      </FormControlContext.Provider>
    )
  },
)
