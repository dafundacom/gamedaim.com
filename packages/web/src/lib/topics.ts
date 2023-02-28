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

export const getArticlesByTopic = async (slug: any, page = 1) => {
  let postData
  try {
    const { data } = await axios.get(`/topic/slug/${slug}/articles/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { topic: postData }
}

export const getDownloadsByTopic = async (slug: any, page = 1) => {
  let postData
  try {
    const { data } = await axios.get(`/topic/slug/${slug}/downloads/${page}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { topic: postData }
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
