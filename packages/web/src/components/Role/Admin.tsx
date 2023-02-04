import * as React from "react"
import { useRouter } from "next/router"

import { AuthContext } from "@/contexts/auth.context"
import { RedirectProgress } from "@/components/Progress"

export function AdminRole({ children }: any) {
  const router = useRouter()
  const [auth] = React.useContext(AuthContext)

  React.useEffect(() => {
    if (auth?.user?.role !== "ADMIN") {
      router.push("/")
    }
  }, [auth?.user?.role, router])

  if (auth?.user?.role !== "ADMIN") {
    return <RedirectProgress />
  }

  return children
}
