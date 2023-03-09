import { FastifyInstance } from "fastify"

import {
  updateWpViewHandler,
  getWpViewHandler,
  getWpViewsHandler,
} from "./wp-view.controller"

import { $ref } from "./wp-view.schema"

async function wpViewRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateWpViewSchema"),
        response: {
          201: $ref("wpViewResponseSchema"),
        },
      },
    },
    updateWpViewHandler,
  )

  server.get(
    "/:wpViewKey",
    {
      schema: {
        response: {
          200: $ref("wpViewsResponseSchema"),
        },
      },
    },
    getWpViewHandler,
  )

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          201: $ref("wpViewsResponseSchema"),
        },
      },
    },
    getWpViewsHandler,
  )
}

export default wpViewRoutes
