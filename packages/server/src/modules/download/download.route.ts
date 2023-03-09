import { FastifyInstance } from "fastify"

import {
  createDownloadHandler,
  deleteDownloadHandler,
  getDownloadByAuthorIdHandler,
  getDownloadByIdHandler,
  getDownloadBySlugHandler,
  getDownloadByTypeHandler,
  getDownloadsHandler,
  getTotalDownloadsHandler,
  searchDownloadsHandler,
  updateDownloadHandler,
  updateDownloadViewCountHandler,
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
    "/search/:searchDownloadQuery",
    {
      schema: {
        response: {
          200: $ref("downloadsResponseSchema"),
        },
      },
    },

    searchDownloadsHandler,
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
    "/slug/:downloadSlug/:downloadPage",
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

  server.put(
    "/update-view/:downloadId",
    {
      schema: {
        response: {
          201: $ref("downloadResponseSchema"),
        },
      },
    },
    updateDownloadViewCountHandler,
  )

  server.delete(
    "/:downloadId",
    { preHandler: [server.authenticate] },
    deleteDownloadHandler,
  )

  server.get("/count", getTotalDownloadsHandler)
}

export default downloadRoutes
