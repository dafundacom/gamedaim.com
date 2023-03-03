import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const scriptInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  }),
  active: z
    .boolean({
      invalid_type_error: "Active must be a boolean",
    })
    .optional(),
}

const updateScriptInput = {
  ...scriptInput,
}

const scriptGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createScriptSchema = z.object({
  ...scriptInput,
})

const updateScriptSchema = z.object({
  ...updateScriptInput,
})

const scriptResponseSchema = z.object({
  ...scriptInput,
  ...scriptGenerated,
})

const scriptsResponseSchema = z.array(scriptResponseSchema)

export type CreateScriptInput = z.infer<typeof createScriptSchema>
export type UpdateScriptInput = z.infer<typeof updateScriptSchema>

const models = {
  scriptResponseSchema,
  scriptsResponseSchema,
  createScriptSchema,
  updateScriptSchema,
}

export const { schemas: scriptSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "ScriptSchema",
})
