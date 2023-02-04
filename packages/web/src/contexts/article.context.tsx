import * as React from "react"

const ArticleContext = React.createContext<any>(null)

interface ArticleProviderProps {
  children: React.ReactNode
}

const ArticleProvider: React.FunctionComponent<ArticleProviderProps> = (
  props,
) => {
  const { children } = props
  const [article, setArticle] = React.useState({
    articles: [],
    topics: [],
    wpComments: [],
  })

  return (
    <ArticleContext.Provider value={[article, setArticle]}>
      {children}
    </ArticleContext.Provider>
  )
}

export { ArticleProvider, ArticleContext }
