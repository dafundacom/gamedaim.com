import * as React from "react"

const ContentContext = React.createContext<any>(null)

interface ContentProviderProps {
  children: React.ReactNode
}

const ContentProvider: React.FunctionComponent<ContentProviderProps> = (
  props,
) => {
  const { children } = props
  const [content, setContent] = React.useState({
    ads: [],
    articles: [],
    seo: [],
    medias: [],
    topics: [],
    users: [],
  })

  return (
    <ContentContext.Provider value={[content, setContent]}>
      {children}
    </ContentContext.Provider>
  )
}

export { ContentProvider, ContentContext }
