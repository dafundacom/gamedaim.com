import env from "@/env"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const getTopicsCount = async () => {
  let topicsCountData
  try {
    const { data } = await axios.get("/topic/count")
    topicsCountData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { topicsCount: topicsCountData }
}

export const getTopics = async (page = 1) => {
  let topicsData
  try {
    const { data } = await axios.get(`/topic/page/${page}`)
    topicsData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { topics: topicsData }
}
export const getTopicBySlug = async (slug: string) => {
  let postData
  try {
    const { data } = await axios.get(`/topic/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { topic: postData }
}
export const useGetTopicBySlug = (slug: string) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["topic", slug],
    () => getTopicBySlug(slug),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )

  return {
    getTopicBySlugData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
export const useGetTopics = (page = 1) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["topics", page],
    () => getTopics(page),
    {
      staleTime: env.STALE_FIVE_MINUTES,
      keepPreviousData: true,
    },
  )

  return {
    getTopicsData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
export const useGetTopicsCount = () => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["topicsCount"],
    () => getTopicsCount(),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )

  return {
    getTopicsCountData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
