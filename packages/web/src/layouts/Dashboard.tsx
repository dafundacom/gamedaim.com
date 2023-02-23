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
    <div className="relative flex h-auto" {...rest}>
      <div
        className={`${
          open ? "max-lg:!translate-x-0" : null
        } sticky top-0 z-[99] h-screen w-[250px] w-3/12 transition-[transform] max-lg:!fixed max-lg:w-[250px] max-lg:-translate-x-full`}
      >
        <SidebarDashboard />
      </div>
      <div className="w-9/12 px-3 transition-all max-lg:w-full">{children}</div>
      <div className="fixed inset-x-0 bottom-0 z-[9999] flex items-center justify-around border-t bg-white py-3 dark:bg-gray-800 lg:hidden">
        <NextLink
          className="flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around text-center text-gray-800"
          href="/dashboard"
        >
          <Button
            variant="ghost"
            className="h-12 flex-col items-center justify-around !rounded"
          >
            <MdDashboard />
            Dashboard
          </Button>
        </NextLink>
        <NextLink
          className="flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around text-center text-gray-800"
          href="/dashboard/articles"
        >
          <Button
            variant="ghost"
            className="h-12 flex-col items-center justify-around !rounded"
          >
            <MdArticle />
            Articles
          </Button>
        </NextLink>
        <Button
          variant="ghost"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around !rounded text-center text-gray-800"
        >
          <MdMenu />
          More
        </Button>
      </div>
    </div>
  )
}
