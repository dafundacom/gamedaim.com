import { FastifyInstance } from "fastify"
import {
  createScriptHandler,
  deleteScriptHandler,
  updateScriptHandler,
  getScriptsHandler,
  getScriptByIdHandler,
  getTotalScriptsHandler,
} from "./script.controller"
import { $ref } from "./script.schema"

async function scriptRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createScriptSchema"),
        response: {
          201: $ref("scriptResponseSchema"),
        },
      },
    },
    createScriptHandler,
  )

  server.get(
    "/page/:scriptPage",
    {
      schema: {
        response: {
          200: $ref("scriptsResponseSchema"),
        },
      },
    },

    getScriptsHandler,
  )

  server.get(
    "/:scriptId",
    {
      schema: {
        response: {
          200: $ref("scriptsResponseSchema"),
        },
      },
    },
    getScriptByIdHandler,
  )

  server.put(
    "/:scriptId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateScriptSchema"),
        response: {
          201: $ref("scriptResponseSchema"),
        },
      },
    },
    updateScriptHandler,
  )

  server.delete(
    "/:scriptId",
    { preHandler: [server.authenticate] },
    deleteScriptHandler,
  )

  server.get(
    "/count",
    { preHandler: [server.authenticate] },
    getTotalScriptsHandler,
  )
}

export default scriptRoutes
