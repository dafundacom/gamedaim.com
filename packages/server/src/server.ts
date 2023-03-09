import fastify, { FastifyReply, FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import multipart from "@fastify/multipart"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { withRefResolver } from "fastify-zod"
import fastifyFormbody from "@fastify/formbody"

import env from "./env"
import { loggerOption } from "./utils/logger"

import { version } from "../package.json"
import adRoutes from "./modules/ad/ad.route"
import { adSchemas } from "./modules/ad/ad.schema"
import articleRoutes from "./modules/article/article.route"
import { articleSchemas } from "./modules/article/article.schema"
import commentRoutes from "./modules/comment/comment.route"
import { commentSchemas } from "./modules/comment/comment.schema"
import downloadFileRoutes from "./modules/download-file/download-file.route"
import { downloadFileSchemas } from "./modules/download-file/download-file.schema"
import downloadRoutes from "./modules/download/download.route"
import { downloadSchemas } from "./modules/download/download.schema"
import mediaRoutes from "./modules/media/media.route"
import { mediaSchemas } from "./modules/media/media.schema"
import scriptRoutes from "./modules/script/script.route"
import { scriptSchemas } from "./modules/script/script.schema"
import settingRoutes from "./modules/setting/setting.route"
import { settingSchemas } from "./modules/setting/setting.schema"
import topicRoutes from "./modules/topic/topic.route"
import { topicSchemas } from "./modules/topic/topic.schema"
import topupRoutes from "./modules/top-up/topup.route"
import { topUpSchemas } from "./modules/top-up/top-up.schema"
import userRoutes from "./modules/user/user.route"
import { userSchemas } from "./modules/user/user.schema"
import wpCommentRoutes from "./modules/wp-comment/wp-comment.route"
import { wpCommentSchemas } from "./modules/wp-comment/wp-comment.schema"
import wpViewRoutes from "./modules/wp-view/wp-view.route"
import { wpViewSchemas } from "./modules/wp-view/wp-view.schema"

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

  server.register(fastifyFormbody)

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
    ...commentSchemas,
    ...downloadSchemas,
    ...downloadFileSchemas,
    ...mediaSchemas,
    ...scriptSchemas,
    ...topicSchemas,
    ...topUpSchemas,
    ...wpCommentSchemas,
    ...wpViewSchemas,
    ...settingSchemas,
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
  server.register(commentRoutes, { prefix: "api/comment" })
  server.register(downloadRoutes, { prefix: "api/download" })
  server.register(downloadFileRoutes, { prefix: "api/download-file" })
  server.register(topicRoutes, { prefix: "api/topic" })
  server.register(topupRoutes, { prefix: "api/top-up" })
  server.register(mediaRoutes, { prefix: "api/media" })
  server.register(scriptRoutes, { prefix: "api/script" })
  server.register(wpCommentRoutes, { prefix: "api/wp-comment" })
  server.register(wpViewRoutes, { prefix: "api/wp-view" })
  server.register(settingRoutes, { prefix: "api/setting" })

  return server
}

export default buildServer
