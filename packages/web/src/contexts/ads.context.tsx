import * as React from "react"

const AdContext = React.createContext<any>(null)

interface AdProviderProps {
  children: React.ReactNode
}

const AdProvider: React.FunctionComponent<AdProviderProps> = (props) => {
  const { children } = props
  const [ad, setAd] = React.useState({
    ads: [],
  })

  return <AdContext.Provider value={[ad, setAd]}>{children}</AdContext.Provider>
}

export { AdProvider, AdContext }
