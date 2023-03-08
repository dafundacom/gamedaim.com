import { FastifyReply, FastifyRequest } from "fastify"
import { CreateSettingInput } from "./setting.schema"

import { createSetting, findSettingByKey, getSettings } from "./setting.service"

export async function createSettingHandler(
  request: FastifyRequest<{ Body: CreateSettingInput }>,
  reply: FastifyReply,
) {
  try {
    const { key, value } = request.body

    const user = request.user
    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const setting = await createSetting({
      key,
      value,
    })

    return reply.code(201).send(setting)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getSettingByKeyHandler(
  request: FastifyRequest<{ Params: { settingKey: string } }>,
  reply: FastifyReply,
) {
  try {
    const { settingKey } = request.params
    const setting = await findSettingByKey(settingKey)
    return reply.code(201).send(setting)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getSettingsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user
    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const settings = await getSettings()
    return reply.code(201).send(settings)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
