import * as React from "react"

import { fetch } from "@/lib/fetch"

export const AuthContext = React.createContext<any>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = (
  props,
) => {
  const { children } = props

  const [auth, setAuth] = React.useState({
    user: null,
    accessToken: "",
  })

  fetch.defaults.headers.common["Authorization"] = `Bearer ${auth?.accessToken}`

  React.useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(JSON.parse(localStorage.getItem("auth") as string))
    }
  }, [])

  function logout() {
    setAuth({
      user: null,
      accessToken: "",
    })
    localStorage.removeItem("accessToken")
  }

  return (
    <AuthContext.Provider value={[auth, setAuth, logout]}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
