import * as React from "react"
import { useRouter } from "next/router"

import { AuthContext } from "@/contexts/auth.context"
import { RedirectProgress } from "@/components/Progress"

export function AuthorRole({ children }: any) {
  const router = useRouter()
  const [auth] = React.useContext(AuthContext)

  React.useEffect(() => {
    if (auth?.user?.role !== "AUTHOR") {
      router.push("/")
    }
  }, [auth?.user?.role, router])

  if (auth?.user?.role !== "AUTHOR") {
    return <RedirectProgress />
  }

  return children
}
