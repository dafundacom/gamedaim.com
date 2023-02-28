import axios from "axios"

export const getArticlesCount = async () => {
  let articlesCountData
  try {
    const { data } = await axios.get("/article/count")
    articlesCountData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { articlesCount: articlesCountData }
}

export const getArticles = async (page = 1) => {
  let articlesData
  try {
    const { data } = await axios.get(`/article/page/${page}`)
    articlesData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { articles: articlesData }
}

export const getArticleBySlug = async (slug: string) => {
  let postData
  try {
    const { data } = await axios.get(`/article/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { article: postData }
}
