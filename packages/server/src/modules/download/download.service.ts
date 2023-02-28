import db from "../../utils/db"
import { CreateDownloadInput } from "./download.schema"

export async function createDownload(
  data: CreateDownloadInput & {
    slug: string
    authorId: string
    featuredImageId: string
    downloadFileIds?: string[]
    downloadFiles: { connect: { id: string }[] }
  },
) {
  return await db.download.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getDownloads(downloadPage: number, perPage: number) {
  return await db.download.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (downloadPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      developer: true,
      operationSystem: true,
      license: true,
      officialWeb: true,
      schemaType: true,
      type: true,
      status: true,
      downloadFiles: {
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          downloadLink: true,
          fileSize: true,
          currency: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })
}

export async function findDownloadById(downloadId: string) {
  return await db.download.findUnique({
    where: { id: downloadId },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      developer: true,
      operationSystem: true,
      license: true,
      officialWeb: true,
      schemaType: true,
      type: true,
      status: true,
      downloadFiles: {
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          downloadLink: true,
          fileSize: true,
          currency: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })
}

export async function findDownloadByType(
  downloadType: string,
  downloadPage: number,
  perPage: number,
) {
  return await db.download.findMany({
    //@ts-ignore
    where: { type: downloadType },
    orderBy: {
      createdAt: "desc",
    },
    skip: (downloadPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      developer: true,
      operationSystem: true,
      license: true,
      officialWeb: true,
      schemaType: true,
      type: true,
      status: true,
      downloadFiles: {
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          downloadLink: true,
          fileSize: true,
          currency: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })
}

export async function findDownloadByAuthorId(
  authorId: string,
  downloadPage: number,
  perPage: number,
) {
  return await db.download.findMany({
    where: { authorId: authorId },
    orderBy: {
      createdAt: "desc",
    },
    skip: (downloadPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      developer: true,
      operationSystem: true,
      license: true,
      officialWeb: true,
      schemaType: true,
      type: true,
      status: true,
      downloadFiles: {
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          downloadLink: true,
          fileSize: true,
          currency: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })
}

export async function findDownloadBySlug(
  downloadSlug: string,
  downloadPage: number,
  perPage: number,
) {
  return await db.download.findUnique({
    where: { slug: downloadSlug },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      developer: true,
      operationSystem: true,
      license: true,
      officialWeb: true,
      schemaType: true,
      type: true,
      status: true,
      downloadFiles: {
        skip: (downloadPage - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          downloadLink: true,
          fileSize: true,
          currency: true,
          price: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })
}

export async function updateDownload(
  downloadId: string,
  data: CreateDownloadInput & {
    slug: string
    featuredImageId: string
    downloadFileIds?: string[]
    downloadFiles: { connect: { id: string }[] }
  },
) {
  return await db.download.update({
    where: { id: downloadId },
    //@ts-ignore
    data,
  })
}
export async function searchDownloads(searchDownloadQuery: string) {
  return await db.download.findMany({
    where: {
      OR: [
        { title: { contains: searchDownloadQuery } },
        { content: { contains: searchDownloadQuery } },
        { slug: { contains: searchDownloadQuery } },
      ],
    },
  })
}

export async function deleteDownloadById(downloadId: string) {
  return await db.download.delete({
    where: {
      id: downloadId,
    },
  })
}

export async function getTotalDownloads() {
  return await db.download.count()
}
