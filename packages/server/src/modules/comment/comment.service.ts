import db from "../../utils/db"
import { CreateCommentInput } from "./comment.schema"

export async function createComment(
  data: CreateCommentInput & {
    authorId: string
    articleId: string
  },
) {
  return await db.comment.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getComments(commentPage: number, perPage: number) {
  return await db.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (commentPage - 1) * perPage,
    take: perPage,
    select: {
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function findCommentById(commentId: string) {
  return await db.comment.findUnique({
    where: { id: commentId },
    select: {
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function updateComment(
  commentId: string,
  data: CreateCommentInput,
) {
  return await db.comment.update({
    where: { id: commentId },
    data,
  })
}

export async function searchComments(searchCommentQuery: string) {
  return await db.comment.findMany({
    where: {
      content: { contains: searchCommentQuery },
    },
    select: {
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function deleteCommentById(commentId: string) {
  return await db.comment.delete({
    where: {
      id: commentId,
    },
  })
}

export async function getTotalComments() {
  return await db.comment.count()
}
