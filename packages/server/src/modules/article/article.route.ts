import { FastifyInstance } from "fastify"

import {
  createArticleHandler,
  getArticlesHandler,
  deleteArticleHandler,
  updateArticleHandler,
  getArticleByIdHandler,
  getArticleBySlugHandler,
  getArticleByAuthorIdHandler,
  getTotalArticlesHandler,
  searchArticlesHandler,
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
    "/search/:searchArticleQuery",
    {
      schema: {
        response: {
          200: $ref("articlesResponseSchema"),
        },
      },
    },

    searchArticlesHandler,
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

  server.get("/count", getTotalArticlesHandler)
}

export default articleRoutes
