import db from "../../utils/db"
import { CreateAdInput } from "./ad.schema"

export async function createAd(
  data: CreateAdInput & {
    authorId: string
  },
) {
  return await db.ad.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getAds(adPage: number, perPage: number) {
  return await db.ad.findMany({
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
      active: true,
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
  return await db.ad.findUnique({
    where: { id: adId },
    select: {
      id: true,
      title: true,
      content: true,
      position: true,
      active: true,
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

export async function updateAd(adId: string, data: CreateAdInput) {
  return await db.ad.update({
    where: { id: adId },
    data,
  })
}

export async function deleteAdById(adId: string) {
  return await db.ad.delete({
    where: {
      id: adId,
    },
  })
}

export async function getTotalAds() {
  return await db.ad.count()
}
