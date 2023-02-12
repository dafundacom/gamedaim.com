import db from "../../utils/db"
import { CreateWpCommentInput, UpdateWpCommentInput } from "./wp-comment.schema"

export async function createWpComment(
  data: CreateWpCommentInput & {
    authorId: string
  },
) {
  return db.wpComment.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getWpComments(wpCommentPage: number, perPage: number) {
  return db.wpComment.findMany({
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
  const wpComment = await db.wpComment.findUnique({
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

  return wpComment
}

export async function findWpCommentByWpPostId(wpPostId: string) {
  const wpComment = await db.wpComment.findUnique({
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

  return wpComment
}

export async function updateWpComment(
  wpCommentId: string,
  data: UpdateWpCommentInput,
) {
  const updatedWpComment = await db.wpComment.update({
    where: { id: wpCommentId },
    data,
  })

  return updatedWpComment
}

export async function deleteWpCommentById(wpCommentId: string) {
  return db.wpComment.delete({
    where: {
      id: wpCommentId,
    },
  })
}

export async function getTotalWpComments() {
  const wpComment = await db.wpComment.count()
  return wpComment
}
