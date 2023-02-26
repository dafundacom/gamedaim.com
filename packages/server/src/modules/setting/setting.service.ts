import db from "../../utils/db"
import { CreateSettingInput } from "./setting.schema"

export async function createSetting(data: CreateSettingInput) {
  //@ts-ignore
  return await db.setting.create({ data })
}

export async function getSettings() {
  return await db.setting.findMany({
    orderBy: {
      createdAt: "asc",
    },
  })
}

export async function findSettingByKey(settingKey: string) {
  return await db.setting.findUnique({
    where: { key: settingKey },
  })
}

export async function updateSetting(
  settingKey: string,
  data: CreateSettingInput,
) {
  return await db.setting.update({
    where: { key: settingKey },
    data,
  })
}
