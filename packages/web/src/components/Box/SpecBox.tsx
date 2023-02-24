import * as React from "react"
import { Heading, Icon, Text, CrossIcon } from "ui"

interface SpecBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  title?: string
  value?: string
}

const SpecBox = React.forwardRef<HTMLDivElement, SpecBoxProps>((props, ref) => {
  const { icon = CrossIcon, title, value, ...rest } = props

  return (
    <div ref={ref} className="flex flex-row space-x-2 p-5" {...rest}>
      <Icon
        as={icon}
        className="h-12 w-12 rounded-lg bg-white p-2 shadow dark:bg-gray-700"
      />
      <div className="flex-col">
        <Heading as="h4" size="md">
          {title}
        </Heading>
        <Text>{value}</Text>
      </div>
    </div>
  )
})

export type { SpecBoxProps }
export { SpecBox }
