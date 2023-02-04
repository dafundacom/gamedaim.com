import * as React from "react"
import { useRouter } from "next/router"

import { AuthContext } from "@/contexts/auth.context"
import { RedirectProgress } from "@/components/Progress"

export function UserRole({ children }: any) {
  const router = useRouter()
  const [auth] = React.useContext(AuthContext)

  React.useEffect(() => {
    if (!auth?.user) {
      router.push("/")
    }
  }, [auth?.user, router])

  if (!auth?.user) {
    return <RedirectProgress />
  }

  return children
}
