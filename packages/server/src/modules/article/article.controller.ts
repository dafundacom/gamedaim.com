import { FastifyReply, FastifyRequest } from "fastify"

import { uniqueSlug, slugify } from "../../utils/slug"
import { CreateArticleInput, UpdateArticleInput } from "./article.schema"
import {
  createArticle,
  getArticles,
  deleteArticleById,
  updateArticle,
  findArticleById,
  findArticleByAuthorId,
  findArticleBySlug,
  getTotalArticles,
  searchArticles,
} from "./article.service"
import { trimText } from "../../utils/trim"

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
    const {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      featuredImageId,
      topicIds,
    } = request.body
    const user = request.user
    const articleSlug = slugify(title.toLowerCase() + "_" + uniqueSlug())

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const generatedExcerpt = !excerpt ? trimText(content, 160) : excerpt
    const generatedMetaTitle = !meta_title ? title : meta_title
    const generatedMetaDescription = !meta_description
      ? generatedExcerpt
      : meta_description

    const article = await createArticle({
      title,
      content,
      excerpt: generatedExcerpt,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDescription,
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

export async function searchArticlesHandler(
  request: FastifyRequest<{ Params: { searchArticleQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchArticleQuery

    const articles = await searchArticles(searchQuery)
    return reply.code(201).send(articles)
  } catch (e) {
    console.log(e)
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
    const {
      title,
      slug,
      content,
      excerpt,
      meta_title,
      meta_description,
      featuredImageId,
      topicIds,
    } = request.body
    const user = request.user
    const articleId = request.params.articleId

    const allowedRoles = ["ADMIN", "AUTHOR"]

    if (!allowedRoles.includes(user.role)) {
      return reply
        .code(403)
        .send({ message: "Only Author and Admin can update article" })
    }

    const updatedArticle = await updateArticle(articleId, {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
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

export async function getArticleBySlugHandler(
  request: FastifyRequest<{
    Params: { articleSlug: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { articleSlug } = request.params
    const article = await findArticleBySlug(articleSlug)
    return reply.code(201).send(article)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getArticleByAuthorIdHandler(
  request: FastifyRequest<{
    Params: { authorId: string; articlePage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { authorId } = request.params

    const perPage = 10
    const articlePage = Number(request.params.articlePage || 1)

    const article = await findArticleByAuthorId(authorId, articlePage, perPage)
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

export async function getTotalArticlesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const articles = await getTotalArticles()
    return reply.code(201).send(articles)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
