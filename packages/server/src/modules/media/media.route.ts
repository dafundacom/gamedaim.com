import { FastifyInstance } from "fastify"

import {
  getMediasHandler,
  getMediaByIdHandler,
  uploadMediaHandler,
  updateMediaHandler,
  deleteMediaHandler,
} from "./media.controller"
import { $ref } from "./media.schema"

async function mediaRoutes(server: FastifyInstance) {
  //TODO: handling upload schema
  server.post(
    "/image",
    {
      preHandler: [server.authenticate],
    },
    uploadMediaHandler,
  )

  server.get(
    "/page/:mediaPage",
    {
      schema: {
        response: {
          200: $ref("mediasResponseSchema"),
        },
      },
    },

    getMediasHandler,
  )

  server.get(
    "/:mediaId",
    {
      schema: {
        response: {
          200: $ref("mediasResponseSchema"),
        },
      },
    },
    getMediaByIdHandler,
  )

  server.put(
    "/:mediaId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateMediaSchema"),
        response: {
          201: $ref("mediaResponseSchema"),
        },
      },
    },
    updateMediaHandler,
  )

  server.delete(
    "/:mediaId",
    { preHandler: [server.authenticate] },
    deleteMediaHandler,
  )
}

export default mediaRoutes
