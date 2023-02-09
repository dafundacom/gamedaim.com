import fastify, { FastifyRequest, FastifyReply } from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import multipart from "@fastify/multipart"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { withRefResolver } from "fastify-zod"

import env from "./env"
import { loggerOption } from "./utils/logger"

import adRoutes from "./modules/ad/ad.route"
import userRoutes from "./modules/user/user.route"
import articleRoutes from "./modules/article/article.route"
import topicRoutes from "./modules/topic/topic.route"
import mediaRoutes from "./modules/media/media.route"
import wpCommentRoutes from "./modules/wp-comment/wp-comment.route"
import { adSchemas } from "./modules/ad/ad.schema"
import { userSchemas } from "./modules/user/user.schema"
import { articleSchemas } from "./modules/article/article.schema"
import { mediaSchemas } from "./modules/media/media.schema"
import { topicSchemas } from "./modules/topic/topic.schema"
import { wpCommentSchemas } from "./modules/wp-comment/wp-comment.schema"
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

  server.get("/health-check", async () => {
    return { status: "OK" }
  })

  server.addHook("preHandler", (req, _reply, next) => {
    req.jwt = server.jwt
    return next()
  })

  server.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 1000000,
      files: 1,
      headerPairs: 2000,
    },
  })

  for (const schema of [
    ...adSchemas,
    ...userSchemas,
    ...articleSchemas,
    ...mediaSchemas,
    ...topicSchemas,
    ...wpCommentSchemas,
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

  server.register(adRoutes, { prefix: "api/ad" })
  server.register(userRoutes, { prefix: "api/user" })
  server.register(articleRoutes, { prefix: "api/article" })
  server.register(topicRoutes, { prefix: "api/topic" })
  server.register(mediaRoutes, { prefix: "api/media" })
  server.register(wpCommentRoutes, { prefix: "api/wp-comment" })

  return server
}

export default buildServer
