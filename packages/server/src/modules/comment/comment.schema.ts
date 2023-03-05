import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const commentInput = {
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1),
  articleId: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  }),
}

const updateCommentInput = {
  ...commentInput,
}

const commentGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createCommentSchema = z.object({
  ...commentInput,
})

const updateCommentSchema = z.object({
  ...updateCommentInput,
})

const commentResponseSchema = z.object({
  ...commentInput,
  ...commentGenerated,
})

const commentsResponseSchema = z.array(commentResponseSchema)

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

const models = {
  commentResponseSchema,
  commentsResponseSchema,
  createCommentSchema,
  updateCommentSchema,
}

export const { schemas: commentSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "CommentSchema",
})
