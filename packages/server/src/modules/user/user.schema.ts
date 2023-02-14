import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Must be a valid email",
    })
    .email(),
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_]*$/), {
      message:
        "Username should be 3-20 characters without spaces, symbol or any special characters",
    }),
  name: z.string(),
  phoneNumber: z
    .string({ invalid_type_error: "Phone Number must be a string" })
    .optional(),
  profilePictureId: z
    .string({ invalid_type_error: "Profile Picture must be a string" })
    .optional(),
  about: z.string({ invalid_type_error: "About must be a string" }).optional(),
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
}

const createUserSchema = z.object({
  ...userCore,
  role: z
    .string({
      invalid_type_error: "Role must be a string",
    })
    .optional(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    //FIX: custom error message not work on password validation
    .regex(
      new RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,64}$/,
      ),
      {
        message:
          "Password should be 8-64 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character!",
      },
    ),
})

const updateUserSchema = z.object({
  ...userCore,
  role: z
    .string({
      invalid_type_error: "Role must be a string",
    })
    .optional(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    //FIX: custom error message not work on password validation
    .regex(
      new RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,64}$/,
      ),
      {
        message:
          "Password should be 8-64 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character!",
      },
    )
    .optional(),
})

const userResponseSchema = z.object({
  id: z.string(),
  profilePicture: z.object({
    id: z.string(),
    url: z.string(),
  }),
  ...userCore,
})

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
})

const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    name: z.string(),
    role: z.string(),
    phoneNumber: z.string().optional(),
    profilePicture: z
      .object({
        id: z.string(),
        url: z.string(),
      })
      .optional(),
    about: z.string().optional(),
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type LoginInput = z.infer<typeof loginSchema>

const models = {
  createUserSchema,
  userResponseSchema,
  updateUserSchema,
  loginSchema,
  loginResponseSchema,
}

export const { schemas: userSchemas, $ref } = buildJsonSchemas(models, {
  //@ts-ignore
  $id: "UserSchema",
})
