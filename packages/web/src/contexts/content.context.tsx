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
    comments: [],
    wpComments: [],
    seo: [],
    medias: [],
    topics: [],
    users: [],
    scripts: [],
    downloads: [],
    downloadFiles: [],
  })

  return (
    <ContentContext.Provider value={[content, setContent]}>
      {children}
    </ContentContext.Provider>
  )
}

export { ContentProvider, ContentContext }
