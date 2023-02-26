import db from "../../utils/db"
import { CreateWpCommentInput, UpdateWpCommentInput } from "./wp-comment.schema"

export async function createWpComment(
  data: CreateWpCommentInput & {
    authorId: string
  },
) {
  return await db.wpComment.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getWpComments(wpCommentPage: number, perPage: number) {
  return await db.wpComment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (wpCommentPage - 1) * perPage,
    take: perPage,
    select: {
      content: true,
      wpPostId: true,
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

export async function findWpCommentById(wpCommentId: string) {
  return await db.wpComment.findUnique({
    where: { id: wpCommentId },
    select: {
      content: true,
      wpPostId: true,
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

export async function findWpCommentByWpPostId(wpPostId: string) {
  return await db.wpComment.findUnique({
    where: { wpPostId: wpPostId },
    select: {
      content: true,
      wpPostId: true,
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

export async function updateWpComment(
  wpCommentId: string,
  data: UpdateWpCommentInput,
) {
  return await db.wpComment.update({
    where: { id: wpCommentId },
    data,
  })
}

export async function deleteWpCommentById(wpCommentId: string) {
  return await db.wpComment.delete({
    where: {
      id: wpCommentId,
    },
  })
}

export async function getTotalWpComments() {
  return await db.wpComment.count()
}
