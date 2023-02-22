import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const downloadInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  content: z.string({
    invalid_type_error: "Content must be a string",
  }),
  excerpt: z
    .string({
      invalid_type_error: "Content must be a string",
    })
    .optional(),
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
  topicIds: z.array(z.string()).optional(),
  featuredImageId: z.string({
    required_error: "Featured Image is required",
    invalid_type_error: "Featured Image must be a string",
  }),
  developer: z.string({
    required_error: "Developer is required",
    invalid_type_error: "Developer must be a string",
  }),
  operationSystem: z.string({
    required_error: "Operation System is required",
    invalid_type_error: "Operation System must be a string",
  }),
  license: z.string({
    required_error: "License is required",
    invalid_type_error: "License must be a string",
  }),
  officialWeb: z.string({
    required_error: "Official Web is required",
    invalid_type_error: "Official Web must be a string",
  }),
  schemaType: z.string({
    required_error: "Schema Type is required",
    invalid_type_error: "Schema Type must be a string",
  }),
  type: z.string({
    required_error: "Download Type is required",
    invalid_type_error: "Download Type Type must be a string",
  }),
}

const updateDownloadInput = {
  ...downloadInput,
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
  featuredImageId: z.string(),
  topicIds: z.array(z.string()).optional(),
}

const downloadGenerated = {
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createDownloadSchema = z.object({
  ...downloadInput,
})

const updateDownloadSchema = z.object({
  ...updateDownloadInput,
})

const downloadResponseSchema = z.object({
  ...downloadInput,
  ...downloadGenerated,
})

const downloadsResponseSchema = z.array(downloadResponseSchema)

export type CreateDownloadInput = z.infer<typeof createDownloadSchema>
export type UpdateDownloadInput = z.infer<typeof updateDownloadSchema>

const models = {
  downloadResponseSchema,
  downloadsResponseSchema,
  createDownloadSchema,
  updateDownloadSchema,
}

export const { schemas: downloadSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "DownloadSchema",
})
