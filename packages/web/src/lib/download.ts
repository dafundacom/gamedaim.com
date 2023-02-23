import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import env from "@/env"

export const getDownloadsCount = async () => {
  let downloadsCountData
  try {
    const { data } = await axios.get("/download/count")
    downloadsCountData = data
  } catch (e) {
    console.log(`Failed to query data: ${e}`)
    throw e
  }

  return { downloadsCount: downloadsCountData }
}

export const getDownloads = async (page = 1) => {
  let downloadsData
  try {
    const { data } = await axios.get(`/download/page/${page}`)
    downloadsData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { downloads: downloadsData }
}

export const getDownloadBySlug = async (slug: string) => {
  let postData
  try {
    const { data } = await axios.get(`/download/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { download: postData }
}
export const getDownloadBySearch = async (search: string) => {
  let postData
  try {
    const { data } = await axios.get(`/download/search/${search}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { download: postData }
}
export const getDownloadByType = async (type: string, page = 1) => {
  let postData
  try {
    const { data } = await axios.get(`/download/type/${type}/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { download: postData }
}
export const useGetDownloadBySlug = (slug: string) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["downloadSlug", slug],
    () => getDownloadBySlug(slug),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getDownloadBySlugData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
export const useGetDownloadBySearch = (search: string) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["downloadSearch", search],
    () => getDownloadBySlug(search),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getDownloadBySearchData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
export const useGetDownloadByType = (type: string, page = 1) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["downloadType", type],
    () => getDownloadByType(type, page),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getDownloadByTypeData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}

export const useGetDownloads = (page = 1) => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["downloads", page],
    () => getDownloads(page),
    {
      staleTime: env.STALE_FIVE_MINUTES,
      keepPreviousData: true,
    },
  )
  return {
    getDownloadsData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}

export const useGetDownloadsCount = () => {
  const { data, isError, isFetching, isSuccess } = useQuery(
    ["downloadsCount"],
    () => getDownloadsCount(),
    {
      staleTime: env.STALE_FIVE_MINUTES,
    },
  )
  return {
    getDownloadsCountData: {
      data: data,
      isError,
      isFetching,
      isSuccess,
    },
  } as const
}
