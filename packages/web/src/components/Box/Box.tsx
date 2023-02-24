import * as React from "react"
import { Heading } from "ui"

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  className?: string
  children?: React.ReactNode
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { title, className, children, ...rest } = props

  const classes = `flex items-center content-center justify-center max-w-md p-8 mx-auto my-4 md:shadow-lg ${className}`
  return (
    <section className={classes} ref={ref} {...rest}>
      <div className="h-100 w-full">
        <Heading bold size="xl" className="mt-12 text-center md:text-2xl">
          {title}
        </Heading>
        {children}
      </div>
    </section>
  )
})

export { Box }
export type { BoxProps }
