import * as React from "react"

interface ArticleDashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  sidebar?: React.ReactNode
}

export const ArticleDashboardLayout: React.FunctionComponent<
  ArticleDashboardLayoutProps
> = (props) => {
  const { isOpen, sidebar, children, ...rest } = props

  return (
    <div className="flex h-screen flex-row flex-wrap" {...rest}>
      <div className="w-full md:px-64 lg:w-10/12 order-1">{children}</div>
      <div
        className={`${
          isOpen == false
            ? "hidden"
            : "border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 z-20 fixed pt-20 top-0 overflow-x-auto h-full opacity-100 flex flex-row mt-16 right-0"
        } `}
      >
        {sidebar}
      </div>
    </div>
  )
}
