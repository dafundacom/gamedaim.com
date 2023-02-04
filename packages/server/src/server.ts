import fastify, { FastifyRequest, FastifyReply } from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { withRefResolver } from "fastify-zod"

import env from "./env"
import { loggerOption } from "./utils/logger"

import userRoutes from "./modules/user/user.route"
import articleRoutes from "./modules/article/article.route"
import topicRoutes from "./modules/topic/topic.route"
import mediaRoutes from "./modules/media/media.route"
import { userSchemas } from "./modules/user/user.schema"
import { articleSchemas } from "./modules/article/article.schema"
import { mediaSchemas } from "./modules/media/media.schema"
import { topicSchemas } from "./modules/topic/topic.schema"
import { version } from "../package.json"

function buildServer() {
  const server = fastify({
    logger: loggerOption[env.NODE_ENV] ?? true,
  })

  //TODO: create whitelist CORS domain
  server.register(cors, {
    origin: "*",
    methods: "GET,PUT,POST,DELETE,OPTIONS",
  })

  server.register(jwt, {
    secret: env.JWT_SECRET,
  })

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (e) {
        return reply.send(e)
      }
    },
  )

  server.get("/health-check", async function () {
    return { status: "OK" }
  })

  server.addHook("preHandler", (req, _reply, next) => {
    req.jwt = server.jwt
    return next()
  })

  for (const schema of [
    ...userSchemas,
    ...articleSchemas,
    ...mediaSchemas,
    ...topicSchemas,
  ]) {
    server.addSchema(schema)
  }

  server.register(
    fastifySwagger,
    withRefResolver({
      routePrefix: "/docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Gamedaim API",
          description: "Gamedaim API",
          version,
        },
      },
    }),
  )

  //@ts-ignore FIX: later
  server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    swaggerOptions: {
      url: "http://localhost:8000/docs/swagger.json",
    },
  })

  server.register(userRoutes, { prefix: "api/user" })
  server.register(articleRoutes, { prefix: "api/article" })
  server.register(topicRoutes, { prefix: "api/topic" })
  server.register(mediaRoutes, { prefix: "api/media" })

  return server
}

export default buildServer
