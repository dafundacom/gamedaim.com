import { FastifyInstance } from "fastify"

import {
  createArticleHandler,
  getArticlesHandler,
  deleteArticleHandler,
  updateArticleHandler,
  getArticleByIdHandler,
  getArticleBySlugHandler,
  getArticleByAuthorIdHandler,
  getArticleByTopicIdHandler,
  getTotalArticlesHandler,
} from "./article.controller"
import { $ref } from "./article.schema"

async function articleRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createArticleSchema"),
        response: {
          201: $ref("articleResponseSchema"),
        },
      },
    },
    createArticleHandler,
  )

  server.get(
    "/page/:articlePage",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },

    getArticlesHandler,
  )

  server.get(
    "/:articleId",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },
    getArticleByIdHandler,
  )

  server.get(
    "/slug/:articleSlug",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },
    getArticleBySlugHandler,
  )

  server.get(
    "/author/:authorId/:articlePage",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },
    getArticleByAuthorIdHandler,
  )

  server.get(
    "/topic/:topicId/:articlePage",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },
    getArticleByTopicIdHandler,
  )

  server.put(
    "/:articleId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateArticleSchema"),
        response: {
          201: $ref("articleResponseSchema"),
        },
      },
    },
    updateArticleHandler,
  )

  server.delete(
    "/:articleId",
    { preHandler: [server.authenticate] },
    deleteArticleHandler,
  )

  server.get(
    "/count",
    { preHandler: [server.authenticate] },
    getTotalArticlesHandler,
  )
}

export default articleRoutes
