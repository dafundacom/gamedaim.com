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
  const media = await db.media.findUnique({
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

  return media
}

export async function updateMedia(mediaId: string, data: UploadMediaInput) {
  const updatedMedia = await db.media.update({
    where: { id: mediaId },
    data,
  })

  return updatedMedia
}

export async function deleteMediaById(mediaId: string) {
  return db.media.delete({
    where: {
      id: mediaId,
    },
  })
}
