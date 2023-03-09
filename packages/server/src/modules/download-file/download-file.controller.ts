import { FastifyReply, FastifyRequest } from "fastify"

import { slugify, uniqueSlug } from "../../utils/slug"
import {
  CreateDownloadFileInput,
  UpdateDownloadFileInput,
} from "./download-file.schema"
import {
  createDownloadFile,
  deleteDownloadFileById,
  findDownloadFileByAuthorId,
  findDownloadFileById,
  findDownloadFileBySlug,
  getDownloadFiles,
  getTotalDownloadFiles,
  searchDownloadFiles,
  updateDownloadFile,
  updateDownloadFileViewCount,
} from "./download-file.service"

export async function createDownloadFileHandler(
  request: FastifyRequest<{
    Body: CreateDownloadFileInput & {
      slug: string
      authorId: string
      featuredImageId: string
      downloadIds: string[]
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      title,
      meta_title,
      meta_description,
      featuredImageId,
      downloadIds,
      version,
      downloadLink,
      fileSize,
      currency,
      price,
    } = request.body
    const user = request.user
    const downloadFileSlug = slugify(title.toLowerCase() + "_" + uniqueSlug())

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const generatedMetaTitle = !meta_title ? title : meta_title
    const generatedMetaDescription = !meta_description
      ? generatedMetaTitle
      : meta_description

    const downloadFile = await createDownloadFile({
      title,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDescription,
      slug: downloadFileSlug,
      downloads: {
        connect: downloadIds.map((id) => ({ id })),
      },
      version,
      downloadLink,
      fileSize,
      currency,
      price,
      featuredImageId,
      authorId: user.id,
    })

    return reply.code(201).send(downloadFile)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function getDownloadFilesHandler(
  request: FastifyRequest<{ Params: { downloadFilePage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const downloadFilePage = Number(request.params.downloadFilePage || 1)

    const downloadFiles = await getDownloadFiles(downloadFilePage, perPage)
    return reply.code(201).send(downloadFiles)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export async function updateDownloadFileHandler(
  request: FastifyRequest<{
    Params: { downloadFileId: string }
    Body: UpdateDownloadFileInput & {
      slug: string
      authorId: string
      featuredImageId: string
      downloadIds: string[]
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      title,
      slug,
      meta_title,
      meta_description,
      featuredImageId,
      downloadIds,
      version,
      downloadLink,
      fileSize,
      currency,
      price,
    } = request.body
    const user = request.user
    const downloadFileId = request.params.downloadFileId

    const allowedRoles = ["ADMIN", "AUTHOR"]

    if (!allowedRoles.includes(user.role)) {
      return reply
        .code(403)
        .send({ message: "Only Author and Admin can update downloadFile" })
    }

    const updatedDownloadFile = await updateDownloadFile(downloadFileId, {
      title,
      meta_title,
      meta_description,
      slug,
      downloads: {
        connect: downloadIds.map((id) => ({ id })),
      },
      version,
      downloadLink,
      fileSize,
      currency,
      price,
      featuredImageId,
    })
    return reply.code(201).send(updatedDownloadFile)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadFileByIdHandler(
  request: FastifyRequest<{
    Params: { downloadFileId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { downloadFileId } = request.params
    const downloadFile = await findDownloadFileById(downloadFileId)
    return reply.code(201).send(downloadFile)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadFileBySlugHandler(
  request: FastifyRequest<{
    Params: { downloadFileSlug: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { downloadFileSlug } = request.params
    const downloadFile = await findDownloadFileBySlug(downloadFileSlug)
    return reply.code(201).send(downloadFile)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getDownloadFileByAuthorIdHandler(
  request: FastifyRequest<{
    Params: { authorId: string; downloadFilePage: number }
  }>,
  reply: FastifyReply,
) {
  try {
    const { authorId } = request.params

    const perPage = 10
    const downloadFilePage = Number(request.params.downloadFilePage || 1)

    const downloadFile = await findDownloadFileByAuthorId(
      authorId,
      downloadFilePage,
      perPage,
    )
    return reply.code(201).send(downloadFile)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function searchDownloadFilesHandler(
  request: FastifyRequest<{ Params: { searchDownloadFileQuery: string } }>,
  reply: FastifyReply,
) {
  try {
    const searchQuery = request.params.searchDownloadFileQuery

    const downloadFiles = await searchDownloadFiles(searchQuery)
    return reply.code(201).send(downloadFiles)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateDownloadFileViewCountHandler(
  request: FastifyRequest<{ Params: { downloadFileId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { downloadFileId } = request.params

    const downloadFileView = await updateDownloadFileViewCount(downloadFileId)
    return reply.code(201).send(downloadFileView)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteDownloadFileHandler(
  request: FastifyRequest<{ Params: { downloadFileId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { downloadFileId } = request.params
    const deleteDownloadFile = await deleteDownloadFileById(downloadFileId)
    return reply.code(201).send(deleteDownloadFile)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalDownloadFilesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const downloadFiles = await getTotalDownloadFiles()
    return reply.code(201).send(downloadFiles)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
