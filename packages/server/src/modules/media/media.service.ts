import db from "../../utils/db"
import { UploadMediaInput } from "./media.schema"

export async function uploadMedia(
  data: UploadMediaInput & { authorId: string },
) {
  return db.media.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getMedias(mediaPage: number, perPage: number) {
  return db.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (mediaPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      name: true,
      description: true,
      alt: true,
      url: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function findMediaById(mediaId: string) {
  return await db.media.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      name: true,
      description: true,
      alt: true,
      url: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  })
}

export async function findMediaByAuthorId(
  authorId: string,
  mediaPage: number,
  perPage: number,
) {
  return await db.media.findMany({
    where: { authorId: authorId },
    orderBy: {
      createdAt: "desc",
    },
    skip: (mediaPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      name: true,
      description: true,
      alt: true,
      url: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  })
}

export async function updateMedia(mediaId: string, data: UploadMediaInput) {
  return await db.media.update({
    where: { id: mediaId },
    data,
  })
}

export async function deleteMediaById(mediaId: string) {
  return db.media.delete({
    where: {
      id: mediaId,
    },
  })
}

export async function getTotalMedias() {
  return await db.media.count()
}
