import { FastifyReply, FastifyRequest } from "fastify"

import { CreateCommentInput, UpdateCommentInput } from "./comment.schema"
import {
  createComment,
  deleteCommentById,
  findCommentById,
  getComments,
  updateComment,
  getTotalComments,
} from "./comment.service"

export async function createCommentHandler(
  request: FastifyRequest<{ Body: CreateCommentInput & { articleId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { content, articleId } = request.body
    const user = request.user

    const comment = await createComment({
      content,
      articleId,
      authorId: user.id,
    })
    return reply.code(201).send(comment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateCommentHandler(
  request: FastifyRequest<{
    Params: { commentId: string }
    Body: UpdateCommentInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { content } = request.body
    const user = request.user
    const commentId = request.params.commentId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const comment = await updateComment(commentId, {
      content,
    })
    return reply.code(201).send(comment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getCommentByIdHandler(
  request: FastifyRequest<{
    Params: { commentId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { commentId } = request.params
    const comment = await findCommentById(commentId)
    return reply.code(201).send(comment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteCommentHandler(
  request: FastifyRequest<{ Params: { commentId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { commentId } = request.params
    const user = request.user
    const deleteComment = await deleteCommentById(commentId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteComment)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getCommentsHandler(
  request: FastifyRequest<{ Params: { commentPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const commentPage = Number(request.params.commentPage || 1)
    const comments = await getComments(commentPage, perPage)
    return reply.code(201).send(comments)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalCommentsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const comments = await getTotalComments()
    return reply.code(201).send(comments)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
