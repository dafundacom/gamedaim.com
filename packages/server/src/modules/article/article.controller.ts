import { FastifyReply, FastifyRequest } from "fastify"
import slugify from "slugify"

import { uniqueSlug } from "../../utils/slug"
import { CreateArticleInput, UpdateArticleInput } from "./article.schema"
import {
  createArticle,
  getArticles,
  deleteArticleById,
  updateArticle,
  findArticleById,
  findArticleBySlug,
} from "./article.service"

export async function createArticleHandler(
  request: FastifyRequest<{
    Body: CreateArticleInput & {
      slug: string
      authorId: string
      featuredImageId: string
      topicIds: string[]
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, content, featuredImageId, topicIds } = request.body
    const user = request.user
    const articleSlug = slugify(title.toLowerCase() + "_" + uniqueSlug())

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const article = await createArticle({
      title,
      content,
      slug: articleSlug,
      topics: {
        connect: topicIds.map((id) => ({ id })),
      },
      featuredImageId,
      authorId: user.id,
    })

    return reply.code(201).send(article)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function getArticlesHandler(
  request: FastifyRequest<{ Params: { articlePage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const articlePage = Number(request.params.articlePage || 1)

    const articles = await getArticles(articlePage, perPage)
    return reply.code(201).send(articles)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function updateArticleHandler(
  request: FastifyRequest<{
    Params: { articleId: string }
    Body: UpdateArticleInput & {
      slug: string
      authorId: string
      featuredImageId: string
      topicIds: string[]
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, slug, content, featuredImageId, topicIds } = request.body
    const user = request.user
    const articleId = request.params.articleId

    const allowedRoles = ["ADMIN", "AUTHOR"]

    if (!allowedRoles.includes(user.role)) {
      return reply
        .code(403)
        .send({ message: "Only Author and Admin can update article" })
    }

    const slugExist = await findArticleBySlug(slug)
    if (slugExist) {
      return reply.code(401).send({ message: "Slug is Already Exist" })
    }

    const updatedArticle = await updateArticle(articleId, {
      title,
      content,
      slug,
      topics: {
        connect: topicIds.map((id) => ({ id })),
      },
      featuredImageId,
    })
    return reply.code(201).send(updatedArticle)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getArticleByIdHandler(
  request: FastifyRequest<{
    Params: { articleId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { articleId } = request.params
    const article = await findArticleById(articleId)
    return reply.code(201).send(article)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteArticleHandler(
  request: FastifyRequest<{ Params: { articleId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { articleId } = request.params
    const deleteArticle = await deleteArticleById(articleId)
    return reply.code(201).send(deleteArticle)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
