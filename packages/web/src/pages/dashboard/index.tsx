//TODO: handling responsive design for articles list.
import * as React from "react"

import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function Dashboard() {
  return (
    <AdminOrAuthorRole>
      <DashboardLayout />
    </AdminOrAuthorRole>
  )
}
