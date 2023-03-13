import { fetch } from "@/lib/fetch"

export const getDownloadFilesCount = async () => {
  let downloadsCountData
  try {
    const { data } = await fetch.get("/download-file/count")
    downloadsCountData = data
  } catch (e) {
    console.log(`Failed to query data: ${e}`)
    throw e
  }

  return { count: downloadsCountData }
}

export const getDownloadFiles = async (page = 1) => {
  let downloadsData
  try {
    const { data } = await fetch.get(`/download-file/page/${page}`)
    downloadsData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { files: downloadsData }
}

export const getDownloadFileBySlug = async (slug: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/download-file/slug/${slug}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }
  return { downloadFile: postData }
}
export const getDownloadFileBySearch = async (search: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/download-file/search/${search}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { downloadFile: postData }
}
