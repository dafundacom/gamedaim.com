import { fetch } from "@/lib/fetch"

export const getScriptsCount = async () => {
  const { data } = await fetch.get("/script/count")
  return data
}

export const getScripts = async (page: number) => {
  let scriptsData
  try {
    const { data } = await fetch.get(`/script/page/${page}`)
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
