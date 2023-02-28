import axios from "axios"

export const getMediasCount = async () => {
  let mediasCountData
  try {
    const { data } = await axios.get("/media/count")
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
    const { data } = await axios.get(`/media/page/${page}`)
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
    const { data } = await axios.get(`/media/slug/${slug}`)
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
    const { data } = await axios.get(`/media/search/${search}`)
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
    const { data } = await axios.get(`/media/type/${type}/${page}`)
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
    const { data } = await axios.get(`/topic/slug/${slug}/medias/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { mediaByTopic: postData }
}
