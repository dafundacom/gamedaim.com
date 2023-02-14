import { FastifyInstance } from "fastify"

import {
  createSettingHandler,
  updateSettingHandler,
  getSettingsHandler,
} from "./setting.controller"

import { $ref } from "./setting.schema"

async function settingRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createSettingSchema"),
        response: {
          201: $ref("settingResponseSchema"),
        },
      },
    },
    createSettingHandler,
  )

  server.put(
    "/:settingKey",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateSettingSchema"),
        response: {
          201: $ref("settingResponseSchema"),
        },
      },
    },
    updateSettingHandler,
  )

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          201: $ref("settingsResponseSchema"),
        },
      },
    },
    getSettingsHandler,
  )
}

export default settingRoutes
