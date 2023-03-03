import { FastifyInstance } from "fastify"
import {
  createTopicHandler,
  deleteTopicHandler,
  getTopicByIdHandler,
  getTopicBySlugAndGetArticlesHandler,
  getTopicBySlugAndGetDownloadsHandler,
  getTopicBySlugHandler,
  getTopicsHandler,
  getTotalTopicsHandler,
  searchTopicsHandler,
  updateTopicHandler,
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
    "/search/:searchTopicQuery",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },

    searchTopicsHandler,
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

  server.get(
    "/slug/:topicSlug",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },
    getTopicBySlugHandler,
  )

  server.get(
    "/slug/:topicSlug/articles/:topicPage",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },
    getTopicBySlugAndGetArticlesHandler,
  )

  server.get(
    "/slug/:topicSlug/downloads/:topicPage",
    {
      schema: {
        response: {
          200: $ref("topicsResponseSchema"),
        },
      },
    },
    getTopicBySlugAndGetDownloadsHandler,
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

  server.get("/count", getTotalTopicsHandler)
}

export default topicRoutes
