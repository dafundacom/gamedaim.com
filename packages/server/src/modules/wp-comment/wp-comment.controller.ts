import { FastifyReply, FastifyRequest } from "fastify"

import { CreateWpCommentInput, UpdateWpCommentInput } from "./wp-comment.schema"
import {
  createWpComment,
  deleteWpCommentById,
  findWpCommentById,
  getTotalWpComments,
  getWpComments,
  searchWpComments,
  updateWpComment,
} from "./wp-comment.service"

export async function createWpCommentHandler(
  request: FastifyRequest<{
    Body: CreateWpCommentInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { wpPostId, content } = request.body
    const user = request.user

    const WpComment = await createWpComment({
      wpPostId,
      content,
      authorId: user.id,
    })

    return reply.code(201).send(WpComment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateWpCommentHandler(
  request: FastifyRequest<{
    Params: { wpCommentId: string }
    Body: UpdateWpCommentInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { content } = request.body
    const WpCommentId = request.params.wpCommentId

    const WpComment = await updateWpComment(WpCommentId, { content })
    return reply.code(201).send(WpComment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getWpCommentByIdHandler(
  request: FastifyRequest<{
    Params: { wpCommentId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { wpCommentId } = request.params
    const WpComment = await findWpCommentById(wpCommentId)
    return reply.code(201).send(WpComment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function searchWpCommentsHandler(
  request: FastifyRequest<{ Params: { searchWpCommentQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchWpCommentQuery

    const comments = await searchWpComments(searchQuery)
    return reply.code(201).send(comments)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteWpCommentHandler(
  request: FastifyRequest<{ Params: { WpCommentId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { WpCommentId } = request.params
    const user = request.user
    const deleteWpComment = await deleteWpCommentById(WpCommentId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteWpComment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getWpCommentsHandler(
  request: FastifyRequest<{ Params: { WpCommentPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const WpCommentPage = Number(request.params.WpCommentPage || 1)
    const WpComments = await getWpComments(WpCommentPage, perPage)
    return reply.code(201).send(WpComments)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalWpCommentsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const wpComments = await getTotalWpComments()
    return reply.code(201).send(wpComments)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
