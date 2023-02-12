import { FastifyInstance } from "fastify"
import {
  loginHandler,
  registerUserHandler,
  getUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  updateUserByAdminHandler,
  getUserByIdHandler,
  getUserByUsernameHandler,
  getTotalUsersHandler,
} from "./user.controller"
import { $ref } from "./user.schema"

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/signup",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("userResponseSchema"),
        },
      },
    },
    registerUserHandler,
  )

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler,
  )

  server.get(
    "/page/:userPage",
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler,
  )

  server.get(
    "/:userId",
    {
      schema: {
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    getUserByIdHandler,
  )

  server.get(
    "/username/:username",
    {
      schema: {
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    getUserByUsernameHandler,
  )

  server.put(
    "/:userId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateUserSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    updateUserHandler,
  )

  server.put(
    "/update-by-admin/:userId",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateUserSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    updateUserByAdminHandler,
  )

  server.delete(
    "/:userId",
    { preHandler: [server.authenticate] },
    deleteUserHandler,
  )

  server.get(
    "/count",
    { preHandler: [server.authenticate] },
    getTotalUsersHandler,
  )
}

export default userRoutes
