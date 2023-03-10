import { FastifyInstance } from "fastify"

import {
  createDownloadFileHandler,
  deleteDownloadFileHandler,
  getDownloadFileByAuthorIdHandler,
  getDownloadFileByIdHandler,
  getDownloadFileBySlugHandler,
  getDownloadFilesHandler,
  getTotalDownloadFilesHandler,
  searchDownloadFilesHandler,
  updateDownloadFileHandler,
  updateDownloadFileViewCountHandler,
} from "./download-file.controller"
import { $ref } from "./download-file.schema"

async function downloadFileRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createDownloadFileSchema"),
        response: {
          201: $ref("downloadFileResponseSchema"),
        },
      },
    },
    createDownloadFileHandler,
  )

  server.get(
    "/page/:downloadFilePage",
    {
      schema: {
        response: {
          200: $ref("downloadFilesResponseSchema"),
        },
      },
    },

    getDownloadFilesHandler,
  )

  server.get(
    "/search/:searchDownloadFileQuery",
    {
      schema: {
        response: {
          200: $ref("downloadFilesResponseSchema"),
        },
      },
    },

    searchDownloadFilesHandler,
  )

  server.get(
    "/:downloadFileId",
    {
      schema: {
        response: {
          200: $ref("downloadFilesResponseSchema"),
        },
      },
    },
    getDownloadFileByIdHandler,
  )

  server.get(
    "/slug/:downloadFileSlug",
    {
      schema: {
        response: {
          200: $ref("downloadFilesResponseSchema"),
        },
      },
    },
    getDownloadFileBySlugHandler,
  )

  server.get(
    "/author/:authorId/:downloadFilePage",
    {
      schema: {
        response: {
          200: $ref("downloadFilesResponseSchema"),
        },
      },
    },
    getDownloadFileByAuthorIdHandler,
  )

  server.put(
    "/:downloadFileId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateDownloadFileSchema"),
        response: {
          201: $ref("downloadFileResponseSchema"),
        },
      },
    },
    updateDownloadFileHandler,
  )

  server.put(
    "/update-view/:downloadFileId",
    {
      schema: {
        response: {
          201: $ref("downloadFileResponseSchema"),
        },
      },
    },
    updateDownloadFileViewCountHandler,
  )

  server.delete(
    "/:downloadFileId",
    { preHandler: [server.authenticate] },
    deleteDownloadFileHandler,
  )

  server.get("/count", getTotalDownloadFilesHandler)
}

export default downloadFileRoutes
