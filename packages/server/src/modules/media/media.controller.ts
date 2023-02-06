import slugify from "slugify"
import { FastifyReply, FastifyRequest } from "fastify"
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

import env from "../../env"
import { uniqueSlug } from "../../utils/slug"
import {
  findMediaById,
  uploadMedia,
  updateMedia,
  deleteMediaById,
  getMedias,
} from "./media.service"
import { UpdateMediaInput } from "./media.schema"

export async function uploadMediaHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = await request.file()
    const user = request.user
    const uniqueName = slugify(uniqueSlug() + "-" + data.filename)

    const s3Config = {
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: `${env.R2_ACCESS_KEY}`,
        secretAccessKey: `${env.R2_SECRET_KEY}`,
      },
      signatureVersion: "v4",
    }

    const fileProperties = {
      Bucket: env.R2_BUCKET,
      Key: uniqueName,
      ContentType: data.mimetype,
      Body: data.file,
    }

    const uploadToBucket = new Upload({
      client: new S3Client(s3Config),
      leavePartsOnError: false,
      params: fileProperties,
    })

    uploadToBucket.on("httpUploadProgress", (progress) => {
      console.log(progress)
    })

    await uploadToBucket.done()

    const upload = await uploadMedia({
      name: uniqueName,
      url: "https://" + env.R2_DOMAIN + "/" + uniqueName,
      type: data.mimetype,
      authorId: user.id,
    })

    reply.code(200).send(upload)
  } catch (e) {
    reply.code(500).send(e)
  }
}

export async function updateMediaHandler(
  request: FastifyRequest<{
    Params: { mediaId: string }
    Body: UpdateMediaInput
  }>,
  reply: FastifyReply,
) {
  try {
    const body = request.body
    const user = request.user
    const mediaId = request.params.mediaId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }
    //@ts-ignore FIX: later
    const media = await updateMedia(mediaId, body)
    return reply.code(201).send(media)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getMediaByIdHandler(
  request: FastifyRequest<{
    Params: { mediaId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { mediaId } = request.params
    const media = await findMediaById(mediaId)
    return reply.code(201).send(media)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteMediaHandler(
  request: FastifyRequest<{ Params: { mediaId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { mediaId } = request.params
    const user = request.user
    const deleteTopic = await deleteMediaById(mediaId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteTopic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

//TODO: make function that delete on R2 too
export async function getMediasHandler(
  request: FastifyRequest<{ Params: { mediaPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const mediaPage = Number(request.params.mediaPage || 1)

    const medias = await getMedias(mediaPage, perPage)
    return reply.code(201).send(medias)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
