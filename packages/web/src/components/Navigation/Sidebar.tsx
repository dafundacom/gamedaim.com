import * as React from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isOpen: boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (props, ref) => {
    const { isOpen, children, ...rest } = props

    return (
      <aside
        className={`${
          isOpen == true && "open-sidenav"
        } dashboard-sidenav absolute h-screen min-h-screen w-[55px] flex-col flex-wrap transition-[width] duration-300 overflow-y-auto rounded bg-white py-4 px-3 shadow-xl dark:bg-gray-800 flex scrollbar`}
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
