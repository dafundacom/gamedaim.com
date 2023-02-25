import * as React from "react"

import { AuthProvider } from "./auth.context"
import { ContentProvider } from "./content.context"

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthProvider>
        <ContentProvider>{children}</ContentProvider>
      </AuthProvider>
    </>
  )
}
