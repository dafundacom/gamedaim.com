import db from "../../utils/db"
import { CreateSettingInput } from "./setting.schema"

export async function createSetting(data: CreateSettingInput) {
  //@ts-ignore
  return db.setting.create({ data })
}

export function getSettings() {
  return db.setting.findMany({
    orderBy: {
      createdAt: "asc",
    },
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
