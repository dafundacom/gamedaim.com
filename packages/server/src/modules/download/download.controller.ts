import { FastifyReply, FastifyRequest } from "fastify"

import { slugify, uniqueSlug } from "../../utils/slug"
import { trimText } from "../../utils/trim"
import { CreateDownloadInput, UpdateDownloadInput } from "./download.schema"
import {
  createDownload,
  deleteDownloadById,
  findDownloadByAuthorId,
  findDownloadById,
  findDownloadBySlug,
  findDownloadByType,
  getDownloads,
  getTotalDownloads,
  searchDownloads,
  updateDownload,
} from "./download.service"

export async function createDownloadHandler(
  request: FastifyRequest<{
    Body: CreateDownloadInput & {
      slug: string
      authorId: string
      featuredImageId: string
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      featuredImageId,
      developer,
      operationSystem,
      license,
      officialWeb,
      schemaType,
      type,
      downloadFileIds,
    } = request.body
    const user = request.user
    const downloadSlug = slugify(title.toLowerCase() + "_" + uniqueSlug())

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const generatedExcerpt = !excerpt ? trimText(content, 160) : excerpt
    const generatedMetaTitle = !meta_title ? title : meta_title
    const generatedMetaDescription = !meta_description
      ? generatedExcerpt
      : meta_description

    const download = await createDownload({
      title,
      content,
      excerpt: generatedExcerpt,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDescription,
      slug: downloadSlug,
      downloadFiles: {
        connect: downloadFileIds.map((id) => ({ id })),
      },
      featuredImageId,
      developer,
      operationSystem,
      license,
      officialWeb,
      schemaType,
      type,
      authorId: user.id,
    })

    return reply.code(201).send(download)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function getDownloadsHandler(
  request: FastifyRequest<{ Params: { downloadPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const downloadPage = Number(request.params.downloadPage || 1)

    const downloads = await getDownloads(downloadPage, perPage)
    return reply.code(201).send(downloads)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function updateDownloadHandler(
  request: FastifyRequest<{
    Params: { downloadId: string }
    Body: UpdateDownloadInput & {
      slug: string
      authorId: string
      featuredImageId: string
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      meta_title,
      meta_description,
      featuredImageId,
      downloadFileIds,
      developer,
      operationSystem,
      license,
      officialWeb,
      schemaType,
      type,
    } = request.body
    const user = request.user
    const downloadId = request.params.downloadId

    const allowedRoles = ["ADMIN", "AUTHOR"]

    if (!allowedRoles.includes(user.role)) {
      return reply
        .code(403)
        .send({ message: "Only Author and Admin can update download" })
    }

    const updatedDownload = await updateDownload(downloadId, {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      slug,
      downloadFiles: {
        connect: downloadFileIds.map((id) => ({ id })),
      },
      featuredImageId,
      developer,
      operationSystem,
      license,
      officialWeb,
      schemaType,
      type,
    })
    return reply.code(201).send(updatedDownload)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadByIdHandler(
  request: FastifyRequest<{
    Params: { downloadId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { downloadId } = request.params
    const download = await findDownloadById(downloadId)
    return reply.code(201).send(download)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadBySlugHandler(
  request: FastifyRequest<{
    Params: { downloadSlug: string; downloadPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { downloadSlug } = request.params

    const perPage = 10
    const downloadPage = Number(request.params.downloadPage || 1)

    const download = await findDownloadBySlug(
      downloadSlug,
      downloadPage,
      perPage,
    )
    return reply.code(201).send(download)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadByTypeHandler(
  request: FastifyRequest<{
    Params: { downloadType: string; downloadPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { downloadType } = request.params

    const perPage = 10
    const downloadPage = Number(request.params.downloadPage || 1)

    const download = await findDownloadByType(
      downloadType,
      downloadPage,
      perPage,
    )

    return reply.code(201).send(download)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadByAuthorIdHandler(
  request: FastifyRequest<{
    Params: { authorId: string; downloadPage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { authorId } = request.params

    const perPage = 10
    const downloadPage = Number(request.params.downloadPage || 1)

    const download = await findDownloadByAuthorId(
      authorId,
      downloadPage,
      perPage,
    )
    return reply.code(201).send(download)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function searchDownloadsHandler(
  request: FastifyRequest<{ Params: { searchDownloadQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchDownloadQuery

    const downloads = await searchDownloads(searchQuery)
    return reply.code(201).send(downloads)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteDownloadHandler(
  request: FastifyRequest<{ Params: { downloadId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { downloadId } = request.params
    const deleteDownload = await deleteDownloadById(downloadId)
    return reply.code(201).send(deleteDownload)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalDownloadsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const downloads = await getTotalDownloads()
    return reply.code(201).send(downloads)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
