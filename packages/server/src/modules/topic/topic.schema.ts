import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const topicInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
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
  featuredImageId: z
    .string({
      invalid_type_error: "featuredImageId must be a string",
    })
    .optional(),
}

const updateTopicInput = {
  ...topicInput,
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
  featuredImageId: z
    .string({
      invalid_type_error: "featuredImageId must be a string",
    })
    .optional(),
}

const topicGenerated = {
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createTopicSchema = z.object({
  ...topicInput,
})

const updateTopicSchema = z.object({
  ...updateTopicInput,
})

const topicResponseSchema = z.object({
  ...topicInput,
  ...topicGenerated,
})

const topicsResponseSchema = z.array(topicResponseSchema)

export type CreateTopicInput = z.infer<typeof createTopicSchema>
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>

const models = {
  topicResponseSchema,
  topicsResponseSchema,
  createTopicSchema,
  updateTopicSchema,
}

export const { schemas: topicSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "TopicSchema",
})
