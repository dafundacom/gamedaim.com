import { FastifyInstance } from "fastify"

import {
  createArticleHandler,
  getArticlesHandler,
  deleteArticleHandler,
  updateArticleHandler,
  getArticleByIdHandler,
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
    "/all/:articlePage",
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
}

export default articleRoutes
