import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import env from "@/env"

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

export const useGetArticleBySlug = (slug: string) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["article", slug],
    () => getArticleBySlug(slug),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getArticleBySlugData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}

export const useGetArticles = (page = 1) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["articles", page],
    () => getArticles(page),
    {
      staleTime: env.STALE_FIVE_MINUTES,
      keepPreviousData: true,
    },
  )
  return {
    getArticlesData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}

export const useGetArticlesCount = () => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["articlesCount"],
    () => getArticlesCount(),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getArticlesCountData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
