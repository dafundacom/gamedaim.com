import slugify from "slugify"
import { FastifyReply, FastifyRequest } from "fastify"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import env from "../../env"
import { s3Client } from "../../utils/s3-client"
import { uniqueSlug } from "../../utils/slug"
import {
  findMediaById,
  findMediaByAuthorId,
  uploadMedia,
  updateMedia,
  deleteMediaById,
  getMedias,
  getTotalMedias,
} from "./media.service"
import { UpdateMediaInput } from "./media.schema"

export async function uploadMediaHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = await request.file()
    const user = request.user
    const uniqueName = slugify(uniqueSlug() + "-" + data.filename, {
      remove: /[*+~()'"!:@]/g,
    })

    const fileProperties = {
      Bucket: env.R2_BUCKET,
      Key: uniqueName,
      ContentType: data.mimetype,
      Body: data.file,
      ACL: "public-read",
    }

    await s3Client.send(new PutObjectCommand(fileProperties))

    const upload = await uploadMedia({
      name: uniqueName,
      // url: "https://" + env.R2_DOMAIN + "/" + uniqueName,
      url: "https://" + env.R2_DOMAIN + "/" + env.R2_BUCKET + "/" + uniqueName,
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
