import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const wpViewInput = {
  wpPostId: z
    .string({
      required_error: "Key is required",
      invalid_type_error: "Key must be a string",
    })
    .min(1),
}

const wpViewGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const updateWpViewSchema = z.object({
  ...wpViewInput,
})

const wpViewResponseSchema = z.object({
  ...wpViewInput,
  ...wpViewGenerated,
})

const wpViewsResponseSchema = z.array(wpViewResponseSchema)

export type UpdateWpViewInput = z.infer<typeof updateWpViewSchema>

const models = {
  wpViewResponseSchema,
  wpViewsResponseSchema,
  updateWpViewSchema,
}

export const { schemas: wpViewSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "WpViewSchema",
})
