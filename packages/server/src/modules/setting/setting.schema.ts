import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const settingInput = {
  key: z
    .string({
      required_error: "Key is required",
      invalid_type_error: "Key must be a string",
    })
    .min(1),
  value: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Value must be a string",
    })
    .min(1),
}

const settingGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createSettingSchema = z.object({
  ...settingInput,
})

const settingResponseSchema = z.object({
  ...settingInput,
  ...settingGenerated,
})

const settingsResponseSchema = z.array(settingResponseSchema)

export type CreateSettingInput = z.infer<typeof createSettingSchema>

const models = {
  settingResponseSchema,
  settingsResponseSchema,
  createSettingSchema,
}

export const { schemas: settingSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "SettingSchema",
})
