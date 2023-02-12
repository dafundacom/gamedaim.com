import * as React from "react"
import NextLink from "next/link"
import { SidebarDashboard } from "@/components/Navigation"
import { Button } from "ui"
import { MdArticle, MdDashboard, MdMenu } from "react-icons/md"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = (
  props,
) => {
  const { children, ...rest } = props
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex relative h-screen flex-col flex-wrap" {...rest}>
      <div
        className={`${
          open ? "max-lg:!translate-x-0" : null
        } max-lg:w-[250px] w-3/12 transition-[transform] h-full max-lg:fixed max-lg:-translate-x-full`}
      >
        <SidebarDashboard />
      </div>
      <div className="px-3 max-lg:w-full w-9/12 transition-all">{children}</div>
      <div className="flex lg:hidden py-3 items-center justify-around fixed bottom-0 inset-x-0 bg-white border-t z-[9999]">
        <NextLink
          className="h-12 text-center cursor-pointer text-gray-800 flex flex-col items-center justify-around basis-1/3"
          href="/dashboard"
        >
          <Button
            variant="ghost"
            className="items-center justify-around flex-col h-12 !rounded"
          >
            <MdDashboard />
            Dashboard
          </Button>
        </NextLink>
        <NextLink
          className="h-12 text-center cursor-pointer text-gray-800 flex flex-col items-center justify-around basis-1/3"
          href="/dashboard/articles"
        >
          <Button
            variant="ghost"
            className="items-center justify-around flex-col h-12 !rounded"
          >
            <MdArticle />
            Articles
          </Button>
        </NextLink>
        <Button
          variant="ghost"
          onClick={() => setOpen((prev) => !prev)}
          className="h-12 text-center flex-col cursor-pointer text-gray-800 flex items-center justify-around basis-1/3 !rounded"
        >
          <MdMenu />
          More
        </Button>
      </div>
    </div>
  )
}
