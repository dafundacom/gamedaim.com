import db from "../../utils/db"
import { CreateAdInput } from "./ad.schema"

export async function createAd(
  data: CreateAdInput & {
    authorId: string
  },
) {
  return db.ad.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getAds(adPage: number, perPage: number) {
  return db.ad.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (adPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      position: true,
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

export async function findAdById(adId: string) {
  const ad = await db.ad.findUnique({
    where: { id: adId },
    select: {
      id: true,
      title: true,
      content: true,
      position: true,
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

  return ad
}

export async function updateAd(adId: string, data: CreateAdInput) {
  const updatedAd = await db.ad.update({
    where: { id: adId },
    data,
  })

  return updatedAd
}

export async function deleteAdById(adId: string) {
  return db.ad.delete({
    where: {
      id: adId,
    },
  })
}
