import * as React from "react"

import { TopNavStore } from "@/components/Navigation"

interface HomeLayoutProps {
  children: React.ReactNode
}

export const StoreLayout = React.forwardRef<HTMLDivElement, HomeLayoutProps>(
  (props, ref) => {
    const { children, ...rest } = props

    return (
      <div ref={ref} {...rest}>
        <TopNavStore />
        <div className="mt-[75px]">{children}</div>
      </div>
    )
  },
)
