import axiosInstance from "@/utils/axiosinstance"

export const getArticlesCount = async () => {
  let articlesCountData
  try {
    const { data } = await axiosInstance.get("/article/count")
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
    const { data } = await axiosInstance.get(`/article/page/${page}`)
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
    const { data } = await axiosInstance.get(`/article/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { article: postData }
}

export const getArticleByAuthorId = async (id: string) => {
  let postData
  try {
    const { data } = await axiosInstance.get(`/article/author/${id}/1`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { articles: postData }
}
