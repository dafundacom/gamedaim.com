import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const mediaInput = {
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name Required",
  }),
  descripton: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  alt: z
    .string({
      invalid_type_error: "Alt must be a string",
    })
    .optional(),
  url: z.string({
    invalid_type_error: "Url must be a string",

    required_error: "Url Required",
  }),
  type: z.string({
    invalid_type_error: "Type must be a string",
    required_error: "Type Required",
  }),
}

const mediaUpload = {
  image: z
    .any()
    .refine((files) => files?.length === 0, "Image is required.")
    .refine(
      (files) => files?.[0]?.size >= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
}

const mediaGenerated = {
  id: z.string(),
  url: z.string(),
  description: z.string().optional(),
  alt: z.string().optional(),
  type: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const uploadMediaSchema = z.object({
  ...mediaInput,
})

const uploadFileMediaSchema = z.object({
  ...mediaUpload,
})

const updateMediaSchema = z.object({
  descripton: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  alt: z
    .string({
      invalid_type_error: "Alt must be a string",
    })
    .optional(),
})

const mediaResponseSchema = z.object({
  ...mediaInput,
  ...mediaGenerated,
})

const mediasResponseSchema = z.array(mediaResponseSchema)

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>
export type UploadMediaFile = z.infer<typeof uploadFileMediaSchema>
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>

const models = {
  uploadMediaSchema,
  uploadFileMediaSchema,
  updateMediaSchema,
  mediaResponseSchema,
  mediasResponseSchema,
}

export const { schemas: mediaSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "MediaSchema",
})
