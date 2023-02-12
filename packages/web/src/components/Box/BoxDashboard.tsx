import * as React from "react"

interface BoxDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  count?: number
  text?: string
}

export const BoxDashboard = React.forwardRef<HTMLDivElement, BoxDashboardProps>(
  (props, ref) => {
    const { icon, count, text, ...rest } = props
    return (
      <div className="p-5 shadow-md rounded-md" {...rest} ref={ref}>
        <div className="flex">{icon}</div>
        <div className="mt-6 text-3xl font-medium leading-8">{count}</div>
        <div className="mt-1 text-base text-slate-500">{text}</div>
      </div>
    )
  },
)
