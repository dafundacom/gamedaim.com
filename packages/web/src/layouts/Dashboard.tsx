import * as React from "react"

import { SidebarDashboard } from "@/components/Navigation"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = (
  props,
) => {
  const { children, ...rest } = props

  return (
    <div className="flex h-screen flex-row flex-wrap" {...rest}>
      <SidebarDashboard />
      <div className="w-full px-3 lg:w-10/12">{children}</div>
    </div>
  )
}
