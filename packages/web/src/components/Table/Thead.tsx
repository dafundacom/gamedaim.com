import * as React from "react"

interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Thead = React.forwardRef<HTMLTableSectionElement, TheadProps>(
  (props, ref) => {
    const { className, ...rest } = props

    return <thead className={className} ref={ref} {...rest} />
  },
)
