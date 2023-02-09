import { FastifyReply, FastifyRequest } from "fastify"
import slugify from "slugify"

import { uniqueSlug } from "../../utils/slug"
import { CreateTopicInput, UpdateTopicInput } from "./topic.schema"
import {
  createTopic,
  deleteTopicById,
  findTopicById,
  findTopicBySlug,
  getTopics,
  updateTopic,
} from "./topic.service"

export async function createTopicHandler(
  request: FastifyRequest<{
    Body: CreateTopicInput & { featuredImageId?: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, description, featuredImageId } = request.body
    const user = request.user
    const slug = slugify(title.toLowerCase() + "_" + uniqueSlug(), {
      remove: /[*+~.()'"!:@]/g,
    })

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const topic = await createTopic({
      title,
      description,
      slug,
      featuredImageId,
      authorId: user.id,
    })
    return reply.code(201).send(topic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateTopicHandler(
  request: FastifyRequest<{
    Params: { topicId: string }
    Body: UpdateTopicInput & { slug: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, slug, description, featuredImageId } = request.body
    const user = request.user
    const topicId = request.params.topicId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const slugExist = await findTopicBySlug(slug)

    if (slugExist) {
      return reply.code(401).send({
        message: "Slug is already exist",
      })
    }

    const topic = await updateTopic(topicId, {
      title,
      description,
      slug,
      featuredImageId,
    })
    return reply.code(201).send(topic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTopicByIdHandler(
  request: FastifyRequest<{
    Params: { topicId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { topicId } = request.params
    const topic = await findTopicById(topicId)
    return reply.code(201).send(topic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteTopicHandler(
  request: FastifyRequest<{ Params: { topicId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { topicId } = request.params
    const user = request.user
    const deleteTopic = await deleteTopicById(topicId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteTopic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTopicsHandler(
  request: FastifyRequest<{ Params: { topicPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const topicPage = Number(request.params.topicPage || 1)
    const topics = await getTopics(topicPage, perPage)
    return reply.code(201).send(topics)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
