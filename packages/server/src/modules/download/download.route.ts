import { FastifyInstance } from "fastify"

import {
  createDownloadHandler,
  getDownloadsHandler,
  deleteDownloadHandler,
  updateDownloadHandler,
  getDownloadByIdHandler,
  getDownloadBySlugHandler,
  getDownloadByTypeHandler,
  getDownloadByAuthorIdHandler,
  getTotalDownloadsHandler,
} from "./download.controller"
import { $ref } from "./download.schema"

async function downloadRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createDownloadSchema"),
        response: {
          201: $ref("downloadResponseSchema"),
        },
      },
    },
    createDownloadHandler,
  )

  server.get(
    "/page/:downloadPage",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },

    getDownloadsHandler,
  )

  server.get(
    "/:downloadId",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },
    getDownloadByIdHandler,
  )

  server.get(
    "/slug/:downloadSlug",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },
    getDownloadBySlugHandler,
  )

  server.get(
    "/type/:downloadType/:downloadPage",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },
    getDownloadByTypeHandler,
  )

  server.get(
    "/author/:authorId/:downloadPage",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },
    getDownloadByAuthorIdHandler,
  )

  server.put(
    "/:downloadId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateDownloadSchema"),
        response: {
          201: $ref("downloadResponseSchema"),
        },
      },
    },
    updateDownloadHandler,
  )

  server.delete(
    "/:downloadId",
    { preHandler: [server.authenticate] },
    deleteDownloadHandler,
  )

  server.get(
    "/count",
    { preHandler: [server.authenticate] },
    getTotalDownloadsHandler,
  )
}

export default downloadRoutes
