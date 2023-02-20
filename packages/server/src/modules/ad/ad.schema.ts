import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const AD_POSITION = ["ABOVE_POST", "BELOW_POST", "INLINE_POST", "POP_UP"]

const adInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  }),
  position: z
    .any()
    .refine(
      (position) => AD_POSITION.includes(position),
      "only ABOVE_POST, BELOW_POST, INLINE_POST, and POP_UP are accepted",
    ),
  active: z
    .boolean({
      invalid_type_error: "Active must be a boolean",
    })
    .optional(),
}

const updateAdInput = {
  ...adInput,
}

const adGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createAdSchema = z.object({
  ...adInput,
})

const updateAdSchema = z.object({
  ...updateAdInput,
})

const adResponseSchema = z.object({
  ...adInput,
  ...adGenerated,
})

const adsResponseSchema = z.array(adResponseSchema)

export type CreateAdInput = z.infer<typeof createAdSchema>
export type UpdateAdInput = z.infer<typeof updateAdSchema>

const models = {
  adResponseSchema,
  adsResponseSchema,
  createAdSchema,
  updateAdSchema,
}

export const { schemas: adSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "AdSchema",
})
