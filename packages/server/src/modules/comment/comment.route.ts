import { FastifyInstance } from "fastify"
import {
  createCommentHandler,
  deleteCommentHandler,
  getCommentByIdHandler,
  getCommentsHandler,
  getTotalCommentsHandler,
  searchCommentsHandler,
  updateCommentHandler,
} from "./comment.controller"

import { $ref } from "./comment.schema"

async function commentRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createCommentSchema"),
        response: {
          201: $ref("commentResponseSchema"),
        },
      },
    },
    createCommentHandler,
  )

  server.get(
    "/page/:commentPage",
    {
      schema: {
        response: {
          200: $ref("commentsResponseSchema"),
        },
      },
    },

    getCommentsHandler,
  )

  server.get(
    "/search/:searchCommentQuery",
    {
      schema: {
        response: {
          200: $ref("commentsResponseSchema"),
        },
      },
    },

    searchCommentsHandler,
  )

  server.get(
    "/:commentId",
    {
      schema: {
        response: {
          200: $ref("commentsResponseSchema"),
        },
      },
    },
    getCommentByIdHandler,
  )

  server.put(
    "/:commentId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateCommentSchema"),
        response: {
          201: $ref("commentResponseSchema"),
        },
      },
    },
    updateCommentHandler,
  )

  server.delete(
    "/:commentId",
    { preHandler: [server.authenticate] },
    deleteCommentHandler,
  )

  server.get("/count", getTotalCommentsHandler)
}

export default commentRoutes
