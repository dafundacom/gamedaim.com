import * as React from "react"
import NextLink from "next/link"

export interface SidebarItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode | undefined
  children?: React.ReactNode
  badge?: string
  href?: any
}

export const SidebarItem = React.forwardRef<HTMLLIElement, SidebarItemProps>(
  (props, ref) => {
    const { icon, badge, children, href, ...rest } = props

    return (
      <li ref={ref} {...rest}>
        <NextLink
          href={href}
          className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          {icon}
          <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
          {badge && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {badge}
            </span>
          )}
        </NextLink>
      </li>
    )
  },
)
