import { FastifyInstance } from "fastify"
import {
  createAdHandler,
  deleteAdHandler,
  getAdByIdHandler,
  getAdsHandler,
  getTotalAdsHandler,
  updateAdHandler,
} from "./ad.controller"
import { $ref } from "./ad.schema"

async function adRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createAdSchema"),
        response: {
          201: $ref("adResponseSchema"),
        },
      },
    },
    createAdHandler,
  )

  server.get(
    "/page/:adPage",
    {
      schema: {
        response: {
          200: $ref("adsResponseSchema"),
        },
      },
    },

    getAdsHandler,
  )

  server.get(
    "/:adId",
    {
      schema: {
        response: {
          200: $ref("adsResponseSchema"),
        },
      },
    },
    getAdByIdHandler,
  )

  server.put(
    "/:adId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateAdSchema"),
        response: {
          201: $ref("adResponseSchema"),
        },
      },
    },
    updateAdHandler,
  )

  server.delete(
    "/:adId",
    { preHandler: [server.authenticate] },
    deleteAdHandler,
  )

  server.get(
    "/count",
    { preHandler: [server.authenticate] },
    getTotalAdsHandler,
  )
}

export default adRoutes
