import * as React from "react"
import NextLink from "next/link"

export interface SidebarToggleItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
  href?: any
}

export const SidebarToggleItem = React.forwardRef<
  HTMLLIElement,
  SidebarToggleItemProps
>((props, ref) => {
  const { children, href, ...rest } = props

  return (
    <li ref={ref} {...rest}>
      <NextLink
        href={href}
        className="group flex w-full items-center rounded-lg p-2 pl-11 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        {children}
      </NextLink>
    </li>
  )
})
