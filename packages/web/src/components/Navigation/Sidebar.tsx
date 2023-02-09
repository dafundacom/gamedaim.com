import * as React from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (props, ref) => {
    const { children, ...rest } = props

    return (
      <aside
        className="relative h-screen min-h-screen w-[55px] hover:w-2/12 flex-col flex-wrap transition-[width] overflow-y-auto rounded bg-white py-4 px-3 shadow-xl dark:bg-gray-800 lg:flex scrollbar"
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
