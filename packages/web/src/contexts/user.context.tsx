import * as React from "react"

const UserContext = React.createContext<any>(null)

interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: React.FunctionComponent<UserProviderProps> = (props) => {
  const { children } = props
  const [user, setUser] = React.useState({
    users: [],
  })

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }
