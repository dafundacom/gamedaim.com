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
    <div className="flex min-h-screen flex-row flex-wrap" {...rest}>
      <div className="order-1 w-full md:px-64 lg:w-10/12">{children}</div>
      <div
        className={`${
          isOpen == false
            ? "hidden"
            : "pt-15 fixed top-0 right-0 z-20 mt-16 flex h-screen flex-row overflow-x-auto border-l border-gray-100 bg-white pb-10 opacity-100 dark:border-gray-700 dark:bg-gray-900"
        } `}
      >
        {sidebar}
      </div>
    </div>
  )
}
