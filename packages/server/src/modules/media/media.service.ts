import db from "../../utils/db"
import { UploadMediaInput } from "./media.schema"

export async function uploadMedia(
  data: UploadMediaInput & { authorId: string },
) {
  return await db.media.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getMedias(mediaPage: number, perPage: number) {
  return await db.media.findMany({
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

export async function searchMedias(searchMediaQuery: string) {
  return await db.media.findMany({
    where: {
      OR: [
        { name: { contains: searchMediaQuery } },
        { description: { contains: searchMediaQuery } },
        { alt: { contains: searchMediaQuery } },
      ],
    },
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

export async function deleteMediaById(mediaId: string) {
  return await db.media.delete({
    where: {
      id: mediaId,
    },
  })
}

export async function deleteMediaByName(mediaName: string) {
  return await db.media.delete({
    where: {
      name: mediaName,
    },
  })
}
export async function getTotalMedias() {
  return await db.media.count()
}
