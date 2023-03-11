import * as React from "react"
import axios from "axios"

import env from "@/env"

const ContentContext = React.createContext<any>(null)

interface ContentProviderProps {
  children: React.ReactNode
}

const ContentProvider: React.FunctionComponent<ContentProviderProps> = (
  props,
) => {
  const { children } = props

  axios.defaults.baseURL = env.API
  axios.defaults.proxy = false

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
