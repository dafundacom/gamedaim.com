import { FastifyReply, FastifyRequest } from "fastify"

import { slugify, uniqueSlug } from "../../utils/slug"
import { CreateTopicInput, UpdateTopicInput } from "./topic.schema"
import {
  createTopic,
  deleteTopicById,
  findTopicById,
  findTopicBySlug,
  findTopicBySlugAndGetArticles,
  findTopicBySlugAndGetDownloads,
  getTopics,
  getTotalTopics,
  searchTopics,
  updateTopic,
  updateTopicViewCount,
} from "./topic.service"

export async function createTopicHandler(
  request: FastifyRequest<{
    Body: CreateTopicInput
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      title,
      description,
      meta_title,
      meta_description,
      featuredImageId,
    } = request.body
    const user = request.user
    const slug = slugify(title.toLowerCase() + "_" + uniqueSlug())

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const topic = await createTopic({
      title,
      description,
      meta_title,
      meta_description,
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
    const {
      title,
      slug,
      description,
      meta_title,
      meta_description,
      featuredImageId,
    } = request.body
    const user = request.user
    const topicId = request.params.topicId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const topic = await updateTopic(topicId, {
      title,
      description,
      meta_title,
      meta_description,
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

export async function getTopicBySlugHandler(
  request: FastifyRequest<{
    Params: { topicSlug: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { topicSlug } = request.params

    const topic = await findTopicBySlug(topicSlug)
    return reply.code(201).send(topic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTopicBySlugAndGetArticlesHandler(
  request: FastifyRequest<{
    Params: { topicSlug: string; topicPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { topicSlug } = request.params

    const perPage = 10
    const topicPage = Number(request.params.topicPage || 1)

    const topic = await findTopicBySlugAndGetArticles(
      topicSlug,
      topicPage,
      perPage,
    )
    return reply.code(201).send(topic)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTopicBySlugAndGetDownloadsHandler(
  request: FastifyRequest<{
    Params: { topicSlug: string; topicPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { topicSlug } = request.params

    const perPage = 10
    const topicPage = Number(request.params.topicPage || 1)

    const topic = await findTopicBySlugAndGetDownloads(
      topicSlug,
      topicPage,
      perPage,
    )
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

export async function searchTopicsHandler(
  request: FastifyRequest<{ Params: { searchTopicQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchTopicQuery

    const topics = await searchTopics(searchQuery)
    return reply.code(201).send(topics)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateTopicViewCountHandler(
  request: FastifyRequest<{ Params: { topicId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { topicId } = request.params

    const topicView = await updateTopicViewCount(topicId)
    return reply.code(201).send(topicView)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalTopicsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const topics = await getTotalTopics()
    return reply.code(201).send(topics)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
