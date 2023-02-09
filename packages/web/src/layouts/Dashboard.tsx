import * as React from "react"

import { SidebarDashboard } from "@/components/Navigation"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = (
  props,
) => {
  const { children, ...rest } = props

  return (
    <div className="flex h-screen flex-col flex-wrap" {...rest}>
      <SidebarDashboard />
      <div className="px-3 dashboard-mainmenu">{children}</div>
    </div>
  )
}
