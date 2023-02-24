import db from "../../utils/db"
import { CreateDownloadFileInput } from "./download-file.schema"

export async function createDownloadFile(
  data: CreateDownloadFileInput & {
    slug: string
    authorId: string
    featuredImageId: string
    downloadIds?: string[]
    downloads: { connect: { id: string }[] }
  },
) {
  return db.downloadFile.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getDownloadFiles(downloadFilePage: number, perPage: number) {
  return db.downloadFile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (downloadFilePage - 1) * perPage,
    take: perPage,
    select: {
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
      downloads: {
        select: {
          title: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
        },
      },
      version: true,
      downloadLink: true,
      fileSize: true,
      currency: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function findDownloadFileById(artilceId: string) {
  return await db.downloadFile.findUnique({
    where: { id: artilceId },
    select: {
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
      downloads: {
        select: {
          title: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
        },
      },
      version: true,
      downloadLink: true,
      fileSize: true,
      currency: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function findDownloadFileByAuthorId(
  authorId: string,
  downloadFilePage: number,
  perPage: number,
) {
  return await db.downloadFile.findMany({
    where: { authorId: authorId },
    orderBy: {
      createdAt: "desc",
    },
    skip: (downloadFilePage - 1) * perPage,
    take: perPage,
    select: {
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
      downloads: {
        select: {
          title: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
        },
      },
      version: true,
      downloadLink: true,
      fileSize: true,
      currency: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function findDownloadFileBySlug(artilceSlug: string) {
  return await db.downloadFile.findUnique({
    where: { slug: artilceSlug },
    select: {
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
      downloads: {
        select: {
          title: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
        },
      },
      version: true,
      downloadLink: true,
      fileSize: true,
      currency: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function updateDownloadFile(
  downloadFileId: string,
  data: CreateDownloadFileInput & {
    slug: string
    featuredImageId: string
    downloadIds?: string[]
    downloads: { connect: { id: string }[] }
  },
) {
  return await db.downloadFile.update({
    where: { id: downloadFileId },
    data,
  })
}

export async function searchDownloadFiles(searchDownloadFileQuery: string) {
  return db.downloadFile.findMany({
    where: {
      OR: [
        { title: { contains: searchDownloadFileQuery } },
        { version: { contains: searchDownloadFileQuery } },
      ],
    },
  })
}

export async function deleteDownloadFileById(downloadFileId: string) {
  return db.downloadFile.delete({
    where: {
      id: downloadFileId,
    },
  })
}

export async function getTotalDownloadFiles() {
  return await db.downloadFile.count()
}
