import * as React from "react"
import NextLink from "next/link"
import { SidebarDashboard } from "@/components/Navigation"
import { Button } from "ui"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = (
  props,
) => {
  const { children, ...rest } = props

  return (
    <div className="flex relative h-screen flex-col flex-wrap" {...rest}>
      <SidebarDashboard />
      <div className="max-lg:pl-[65px] lg:pl-[270px] pr-3 transition-all dashboard-mainmenu">
        {children}
      </div>
      <div className="flex items-center justify-around fixed bottom-0 inset-x-0 bg-white border-t z-[9999]">
        <NextLink
          className="h-12 text-center cursor-pointer text-gray-800 flex flex-col items-center justify-around pt-[10px] px-[10px] pb-[15px] basis-1/3"
          href="/dashboard"
        >
          <Button>Dashboard</Button>
        </NextLink>
        <NextLink
          className="h-12 text-center cursor-pointer text-gray-800 flex flex-col items-center justify-around pt-[10px] px-[10px] pb-[15px] basis-1/3"
          href="/dashboard/articles"
        >
          <Button>Articles</Button>
        </NextLink>
        <NextLink
          className="h-12 text-center cursor-pointer text-gray-800 flex flex-col items-center justify-around pt-[10px] px-[10px] pb-[15px] basis-1/3"
          href="/dashboard"
        >
          <Button>More</Button>
        </NextLink>
      </div>
    </div>
  )
}
