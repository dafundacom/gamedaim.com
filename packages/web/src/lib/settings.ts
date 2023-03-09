import axios from "axios"

export const getSettingByKey = async (key: string) => {
  let setting
  try {
    const { data } = await axios.get(`/setting/${key}`)
    setting = data
  } catch (error) {
    console.log(error)
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
