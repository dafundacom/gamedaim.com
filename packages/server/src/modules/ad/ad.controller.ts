import { FastifyReply, FastifyRequest } from "fastify"

import { CreateAdInput, UpdateAdInput } from "./ad.schema"
import {
  createAd,
  deleteAdById,
  findAdById,
  getAds,
  updateAd,
} from "./ad.service"

export async function createAdHandler(
  request: FastifyRequest<{
    Body: CreateAdInput & { featuredImageId?: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, content, position } = request.body
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const ad = await createAd({
      title,
      content,
      position,
      authorId: user.id,
    })
    return reply.code(201).send(ad)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateAdHandler(
  request: FastifyRequest<{
    Params: { adId: string }
    Body: UpdateAdInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, content, position } = request.body
    const user = request.user
    const adId = request.params.adId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const ad = await updateAd(adId, {
      title,
      content,
      position,
    })
    return reply.code(201).send(ad)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getAdByIdHandler(
  request: FastifyRequest<{
    Params: { adId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { adId } = request.params
    const ad = await findAdById(adId)
    return reply.code(201).send(ad)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteAdHandler(
  request: FastifyRequest<{ Params: { adId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { adId } = request.params
    const user = request.user
    const deleteAd = await deleteAdById(adId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteAd)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getAdsHandler(
  request: FastifyRequest<{ Params: { adPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const adPage = Number(request.params.adPage || 1)
    const ads = await getAds(adPage, perPage)
    return reply.code(201).send(ads)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
