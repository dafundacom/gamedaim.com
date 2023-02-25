import * as React from "react"

import { TopNav } from "@/components/Navigation"
import { Container } from "ui"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DefaultLayout: React.FunctionComponent<DashboardLayoutProps> = (
  props,
) => {
  const { children, ...rest } = props

  return (
    <div {...rest}>
      <TopNav />
      <Container>{children}</Container>
    </div>
  )
}
