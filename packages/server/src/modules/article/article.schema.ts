import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const articleInput = {
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
  featuredImageId: z.string({
    invalid_type_error: "Featured Image must be a string",
  }),
  topicIds: z.array(z.string()).optional(),
}

const updateArticleInput = {
  ...articleInput,
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

const articleGenerated = {
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

const createArticleSchema = z.object({
  ...articleInput,
})

const updateArticleSchema = z.object({
  ...updateArticleInput,
})

const articleResponseSchema = z.object({
  ...articleInput,
  ...articleGenerated,
})

const articlesResponseSchema = z.array(articleResponseSchema)

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>

const models = {
  articleResponseSchema,
  articlesResponseSchema,
  createArticleSchema,
  updateArticleSchema,
}

export const { schemas: articleSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "ArticleSchema",
})
