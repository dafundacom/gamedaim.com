import * as React from "react"

const MediaContext = React.createContext<any>(null)

interface MediaProviderProps {
  children: React.ReactNode
}

const MediaProvider: React.FunctionComponent<MediaProviderProps> = (props) => {
  const { children } = props
  const [media, setMedia] = React.useState({
    medias: [],
    selected: null,
    showMediaModal: false,
  })

  return (
    <MediaContext.Provider value={[media, setMedia]}>
      {children}
    </MediaContext.Provider>
  )
}

export { MediaContext, MediaProvider }
