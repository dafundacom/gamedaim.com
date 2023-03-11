import axiosInstance from "@/utils/axiosinstance"

export const getScriptsCount = async () => {
  const { data } = await axiosInstance.get("/script/count")
  return data
}

export const getScripts = async (page: number) => {
  let scriptsData
  try {
    const { data } = await axiosInstance.get(`/script/page/${page}`)
    scriptsData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }
  const scripts = scriptsData.filter(
    (script: { active: boolean }) => script.active === true,
  )
  if (!scripts) {
    return {
      error: "Something went wrong",
    }
  }
  return { scripts: scripts }
}
