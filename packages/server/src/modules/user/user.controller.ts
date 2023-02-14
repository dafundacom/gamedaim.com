import { FastifyReply, FastifyRequest } from "fastify"

import { comparePassword } from "../../utils/password"
import { CreateUserInput, LoginInput, UpdateUserInput } from "./user.schema"
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  findUsers,
  updateUser,
  getTotalUsers,
} from "./user.service"

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      email,
      username,
      name,
      password,
      meta_title,
      meta_description,
      phoneNumber,
      profilePictureId,
      about,
    } = request.body

    const emailExist = await findUserByEmail(email)
    if (emailExist) {
      return reply.code(401).send({
        message: "Email is taken",
      })
    }

    const usernameExist = await findUserByUsername(username)
    if (usernameExist) {
      return reply.code(401).send({
        message: "Username is already exist",
      })
    }

    const generatedMetaTitle = !meta_title ? name : meta_title
    const generatedMetaDescription = !meta_description
      ? about
      : meta_description

    const user = await createUser({
      email,
      username,
      name,
      password,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDescription,
      phoneNumber,
      profilePictureId,
      about,
    })
    return reply.code(201).send(user)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { email, password } = request.body

    const user = await findUserByEmail(email)

    if (!user) {
      return reply.code(401).send({
        message: "Invalid email or password",
      })
    }

    const correctPassword = comparePassword(password, user.password)

    if (!correctPassword) {
      return reply.code(401).send({
        message: "Invalid email or password",
      })
    }

    const accessToken = request.jwt.sign(user, {
      expiresIn: "7d",
    })

    return { user, accessToken }
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Params: { userId: string }
    Body: UpdateUserInput
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      email,
      username,
      name,
      meta_title,
      meta_description,
      phoneNumber,
      profilePictureId,
      about,
    } = request.body

    const user = request.user
    const userId = request.params.userId

    if (user.id !== userId) {
      return reply
        .code(403)
        .send({ message: "You only can update your account" })
    }

    // TODO: check username and email if already exist

    // const emailExist = await findUserByEmail(body.email)
    // if (emailExist) {
    //   return reply.code(401).send({
    //     message: "Email is taken",
    //   })
    // }
    //
    // const usernameExist = await findUserByUsername(body.username)
    // if (usernameExist) {
    //   return reply.code(401).send({
    //     message: "Username is already exist",
    //   })
    // }

    const updatedUser = await updateUser(userId, {
      email,
      username,
      name,
      meta_title,
      meta_description,
      phoneNumber,
      profilePictureId,
      about,
    })

    return reply.code(201).send(updatedUser)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateUserByAdminHandler(
  request: FastifyRequest<{
    Params: { userId: string }
    Body: UpdateUserInput
  }>,
  reply: FastifyReply,
) {
  try {
    const {
      email,
      username,
      name,
      meta_title,
      meta_description,
      phoneNumber,
      profilePictureId,
      about,
    } = request.body
    const user = request.user
    const userId = request.params.userId

    if (user.role !== "ADMIN") {
      return reply
        .code(403)
        .send({ message: "You only can update your account" })
    }

    // TODO: check username and email if already exist

    // const emailExist = await findUserByEmail(email)
    // if (emailExist) {
    //   return reply.code(401).send({
    //     message: "Email is taken",
    //   })
    // }
    //
    // const usernameExist = await findUserByUsername(username)
    // if (usernameExist) {
    //   return reply.code(401).send({
    //     message: "Username is already exist",
    //   })
    // }

    const updatedUser = await updateUser(userId, {
      email,
      username,
      name,
      meta_title,
      meta_description,
      phoneNumber,
      profilePictureId,
      about,
    })
    return reply.code(201).send(updatedUser)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { userId } = request.params

    const deleteUser = await deleteUserById(userId)
    return reply.code(201).send(deleteUser)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getUsersHandler(
  request: FastifyRequest<{ Params: { userPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const user = request.user
    const perPage = 10
    const userPage = Number(request.params.userPage || 1)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const users = await findUsers(userPage, perPage)
    return reply.code(201).send(users)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getUserByIdHandler(
  request: FastifyRequest<{
    Params: { userId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { userId } = request.params

    const user = await findUserById(userId)
    return reply.code(201).send(user)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getUserByUsernameHandler(
  request: FastifyRequest<{
    Params: { username: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { username } = request.params

    const user = await findUserByUsername(username)
    return reply.code(201).send(user)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const users = await getTotalUsers()
    return reply.code(201).send(users)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
