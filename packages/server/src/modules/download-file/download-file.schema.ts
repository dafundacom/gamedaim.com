import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const downloadFileInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  meta_title: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  meta_description: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  featuredImageId: z.string({
    required_error: "Featured Image is required",
    invalid_type_error: "Featured Image must be a string",
  }),
  version: z.string({
    required_error: "Version is required",
    invalid_type_error: "Version must be a string",
  }),
  downloadLink: z.string({
    required_error: "Download Link is required",
    invalid_type_error: "Download Link must be a string",
  }),
  fileSize: z.string({
    required_error: "File Size is required",
    invalid_type_error: "File Size must be a string",
  }),
  currency: z.string({
    required_error: "Currency is required",
    invalid_type_error: "Currency must be a string",
  }),
  price: z.string({
    required_error: "Price is required",
    invalid_type_error: "Price must be a string",
  }),
  downloadIds: z.array(z.string()).optional(),
}

const updateDownloadFileInput = {
  ...downloadFileInput,
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
}

const downloadFileGenerated = {
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createDownloadFileSchema = z.object({
  ...downloadFileInput,
})

const updateDownloadFileSchema = z.object({
  ...updateDownloadFileInput,
})

const downloadFileResponseSchema = z.object({
  ...downloadFileInput,
  ...downloadFileGenerated,
})

const downloadFilesResponseSchema = z.array(downloadFileResponseSchema)

export type CreateDownloadFileInput = z.infer<typeof createDownloadFileSchema>
export type UpdateDownloadFileInput = z.infer<typeof updateDownloadFileSchema>

const models = {
  downloadFileResponseSchema,
  downloadFilesResponseSchema,
  createDownloadFileSchema,
  updateDownloadFileSchema,
}

export const { schemas: downloadFileSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "DownloadFileSchema",
})
