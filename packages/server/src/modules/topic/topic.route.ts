import { FastifyInstance } from "fastify"
import {
  createTopicHandler,
  deleteTopicHandler,
  updateTopicHandler,
  getTopicsHandler,
  getTopicByIdHandler,
} from "./topic.controller"
import { $ref } from "./topic.schema"

async function topicRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createTopicSchema"),
        response: {
          201: $ref("topicResponseSchema"),
        },
      },
    },
    createTopicHandler,
  )

  server.get(
    "/page/:topicPage",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },

    getTopicsHandler,
  )

  server.get(
    "/:topicId",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },
    getTopicByIdHandler,
  )

  server.put(
    "/:topicId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateTopicSchema"),
        response: {
          201: $ref("topicResponseSchema"),
        },
      },
    },
    updateTopicHandler,
  )

  server.delete(
    "/:topicId",
    { preHandler: [server.authenticate] },
    deleteTopicHandler,
  )
}

export default topicRoutes
