import axios from "axios"

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
    const { data } = await axios.get(`/download/slug/${slug}/1`)
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

  return { downloadByType: postData }
}
export const getDownloadByTopics = async (slug: string, page = 1) => {
  let postData
  try {
    const { data } = await axios.get(`/topic/slug/${slug}/downloads/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { downloadByTopic: postData }
}
