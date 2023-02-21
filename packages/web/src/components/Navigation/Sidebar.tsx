import * as React from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (props, ref) => {
    const { children, ...rest } = props

    return (
      <aside
        className={`scrollbar flex h-[inherit] flex-col flex-wrap overflow-y-auto rounded bg-white px-3 pt-4 pb-12 shadow-xl transition-[width] duration-300 dark:bg-gray-800`}
        aria-label="Sidebar"
        ref={ref}
        {...rest}
      >
        <div>
          <ul className="space-y-2">{children}</ul>
        </div>
      </aside>
    )
  },
)
