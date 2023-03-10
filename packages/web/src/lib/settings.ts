import axios from "axios"

export const getSettingByKey = async (key: string) => {
  let setting
  try {
    const { data } = await axios.get(`/setting/${key}`)
    setting = data
  } catch (error) {
    console.log(error)
    return {
      setting: {
        [key]: { error: "Something went wrong" },
      },
    }
  }
  if (setting === null || undefined) {
    return {
      setting: {
        [key]: { error: "Something went wrong" },
      },
    }
  }
  return { setting }
}

export const getSettingsSite = async () => {
  const { setting: title } = await getSettingByKey("title")
  const { setting: metaTitle } = await getSettingByKey("meta_title")
  const { setting: description } = await getSettingByKey("description")
  const { setting: metaDescription } = await getSettingByKey("meta_description")
  const { setting: url } = await getSettingByKey("url")
  const { setting: tagline } = await getSettingByKey("tagline")
  return {
    settingsSite: {
      title: title || "",
      metaTitle: metaTitle || "",
      description: description || "",
      metaDescription: metaDescription || "",
      url: url || "",
      tagline: tagline || "",
    },
  }
}
