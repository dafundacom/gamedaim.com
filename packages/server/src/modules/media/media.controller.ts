import { FastifyReply, FastifyRequest } from "fastify"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

import env from "../../env"
import { uniqueSlug, slugifyFile } from "../../utils/slug"
import { s3Client } from "../../utils/s3-client"
import {
  findMediaById,
  findMediaByAuthorId,
  uploadMedia,
  updateMedia,
  deleteMediaById,
  getMedias,
  getTotalMedias,
  searchMedias,
  deleteMediaByName,
} from "./media.service"
import { UpdateMediaInput } from "./media.schema"

// NOTE: cannot use PutObjectCommand because fastify/multipart doesnt provide contentLengt for S3
export async function uploadMediaHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = await request.file()
    const user = request.user

    const uniqueName = slugifyFile(uniqueSlug() + "-" + data.filename)

    const fileProperties = {
      Bucket: env.R2_BUCKET,
      Key: uniqueName,
      ContentType: data.mimetype,
      Body: data.file,
    }

    const uploadToBucket = new Upload({
      client: s3Client,
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

export async function getMediaByAuthorIdHandler(
  request: FastifyRequest<{
    Params: { authorId: string; mediaPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { authorId } = request.params

    const perPage = 10
    const mediaPage = Number(request.params.mediaPage || 1)

    const media = await findMediaByAuthorId(authorId, mediaPage, perPage)
    return reply.code(201).send(media)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteMediaByIdHandler(
  request: FastifyRequest<{ Params: { mediaId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { mediaId } = request.params
    const user = request.user
    const deleteMedia = await deleteMediaById(mediaId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteMedia)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteMediaByNameHandler(
  request: FastifyRequest<{ Params: { mediaName: string } }>,
  reply: FastifyReply,
) {
  try {
    const { mediaName } = request.params
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const fileProperties = {
      Bucket: env.R2_BUCKET,
      Key: mediaName,
    }

    await s3Client.send(new DeleteObjectCommand(fileProperties))

    const deleteMedia = await deleteMediaByName(mediaName)

    return reply.code(201).send(deleteMedia)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

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

export async function searchMediasHandler(
  request: FastifyRequest<{ Params: { searchMediaQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchMediaQuery

    const medias = await searchMedias(searchQuery)
    return reply.code(201).send(medias)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalMediasHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const medias = await getTotalMedias()
    return reply.code(201).send(medias)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
