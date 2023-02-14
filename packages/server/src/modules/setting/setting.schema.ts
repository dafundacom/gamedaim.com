import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const settingInput = {
  key: z.string({
    required_error: "Key is required",
    invalid_type_error: "Key must be a string",
  }),
  value: z.string({
    required_error: "Value is required",
    invalid_type_error: "Value must be a string",
  }),
}

const updateSettingInput = {
  ...settingInput,
}

const settingGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createSettingSchema = z.object({
  ...settingInput,
})

const updateSettingSchema = z.object({
  ...updateSettingInput,
})

const settingResponseSchema = z.object({
  ...settingInput,
  ...settingGenerated,
})

const settingsResponseSchema = z.array(settingResponseSchema)

export type CreateSettingInput = z.infer<typeof createSettingSchema>
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>

const models = {
  settingResponseSchema,
  settingsResponseSchema,
  createSettingSchema,
  updateSettingSchema,
}

export const { schemas: settingSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "SettingSchema",
})
