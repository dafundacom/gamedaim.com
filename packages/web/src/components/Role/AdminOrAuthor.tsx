import * as React from "react"
import { useRouter } from "next/router"

import { AuthContext } from "@/contexts/auth.context"
import { RedirectProgress } from "@/components/Progress"

export function AdminOrAuthorRole({ children }: any) {
  const router = useRouter()
  const [auth] = React.useContext(AuthContext)

  React.useEffect(() => {
    if (!auth?.user || auth?.user?.role === "USER") {
      router.push("/")
    }
  }, [auth?.user, router])

  if (!auth.user || auth?.user?.role === "USER") {
    return <RedirectProgress />
  }

  return children
}
