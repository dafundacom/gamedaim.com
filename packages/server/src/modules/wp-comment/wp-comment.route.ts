import { FastifyInstance } from "fastify"
import {
  createWpCommentHandler,
  deleteWpCommentHandler,
  updateWpCommentHandler,
  getWpCommentsHandler,
  getWpCommentByIdHandler,
} from "./wp-comment.controller"
import { $ref } from "./wp-comment.schema"

async function wpCommentRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createWpCommentSchema"),
        response: {
          201: $ref("wpCommentResponseSchema"),
        },
      },
    },
    createWpCommentHandler,
  )

  server.get(
    "/all/:wpCommentPage",
    {
      schema: {
        response: {
          200: $ref("wpCommentsResponseSchema"),
        },
      },
    },

    getWpCommentsHandler,
  )

  server.get(
    "/:wpCommentId",
    {
      schema: {
        response: {
          200: $ref("wpCommentsResponseSchema"),
        },
      },
    },
    getWpCommentByIdHandler,
  )

  server.put(
    "/:wpCommentId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateWpCommentSchema"),
        response: {
          201: $ref("wpCommentResponseSchema"),
        },
      },
    },
    updateWpCommentHandler,
  )

  server.delete(
    "/:wpCommentId",
    { preHandler: [server.authenticate] },
    deleteWpCommentHandler,
  )
}

export default wpCommentRoutes
