import { FastifyInstance } from "fastify"
import slugify from "slugify"
import multer from "fastify-multer"
import multerS3 from "multer-s3"
import { S3Client } from "@aws-sdk/client-s3"

import env from "../../env"
import { uniqueSlug } from "../../utils/slug"
import {
  getMediasHandler,
  getMediaByIdHandler,
  uploadMediaHandler,
  updateMediaHandler,
  deleteMediaHandler,
} from "./media.controller"
import { $ref } from "./media.schema"

const s3Config = {
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
  credentials: {
    accessKeyId: `${env.R2_ACCESS_KEY}`,
    secretAccessKey: `${env.R2_SECRET_KEY}`,
  },
  signatureVersion: "v4",
}

const s3Client = new S3Client(s3Config)

const upload = multer({
  limits: {
    fileSize: 524288,
  },
  fileFilter(_req, file, next) {
    if (!file.mimetype.startsWith("image")) {
      return next(new Error("Please upload an IMAGE"))
    }
    next(null, true)
  },
  //@ts-ignore FIX: later
  storage: multerS3({
    s3: s3Client,
    bucket: env.R2_BUCKET,
    metadata: function (_req, file, next) {
      next(null, { fieldName: file.fieldname })
    },
    key: function (_req, file, next) {
      next(null, uniqueSlug() + "-" + slugify(file.originalname))
    },
    contentType: function (_req, file, next) {
      next(null, file.mimetype)
    },
  }),
})

async function mediaRoutes(server: FastifyInstance) {
  server.post("/image", {
    preHandler: [server.authenticate, upload.single("image")],
    handler: uploadMediaHandler,
  })

  server.get(
    "/all/:mediaPage",
    {
      schema: {
        response: {
          200: $ref("mediasResponseSchema"),
        },
      },
    },

    getMediasHandler,
  )

  server.get(
    "/:mediaId",
    {
      schema: {
        response: {
          200: $ref("mediasResponseSchema"),
        },
      },
    },
    getMediaByIdHandler,
  )

  server.put(
    "/:mediaId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateMediaSchema"),
        response: {
          201: $ref("mediaResponseSchema"),
        },
      },
    },
    updateMediaHandler,
  )

  server.delete(
    "/:mediaId",
    { preHandler: [server.authenticate] },
    deleteMediaHandler,
  )
}

export default mediaRoutes
