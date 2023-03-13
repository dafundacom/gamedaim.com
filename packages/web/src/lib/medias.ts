import useSWRInfinite from "swr/infinite"

import { fetch, fetcher } from "@/lib/fetch"

export const getMediasCount = async () => {
  let mediasCountData
  try {
    const { data } = await fetch.get("/media/count")
    mediasCountData = data
  } catch (e) {
    console.log(`Failed to query data: ${e}`)
    throw e
  }

  return { mediasCount: mediasCountData }
}

export const getMedias = async (page = 1) => {
  let mediasData
  try {
    const { data } = await fetch.get(`/media/page/${page}`)
    mediasData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { medias: mediasData }
}

export const getMediaBySlug = async (slug: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/media/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { media: postData }
}
export const getMediaBySearch = async (search: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/media/search/${search}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { media: postData }
}
export const getMediaByType = async (type: string, page = 1) => {
  let postData
  try {
    const { data } = await fetch.get(`/media/type/${type}/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { mediaByType: postData }
}
export const getMediaByTopics = async (slug: string, page = 1) => {
  let postData
  try {
    const { data } = await fetch.get(`/topic/slug/${slug}/medias/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { mediaByTopic: postData }
}

export const getKeyMedias = (
  pageIndex: any,
  previousPageData: string | any[],
) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `/media/page/${pageIndex + 1}` // SWR key
}

export function useInfiniteMedias() {
  const { data, size, setSize, mutate } = useSWRInfinite(getKeyMedias, fetcher)

  return {
    medias: data,
    page: size,
    setPage: setSize,
    updateMedias: mutate,
  }
}
