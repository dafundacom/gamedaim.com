import { JWT } from "@fastify/jwt"
import { FastifyZod } from "fastify-zod"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string
      PORT: number
    }
  }
}

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT
    //@ts-ignore
    file: File<{ originalname: string; authorId: string }>
    user: {
      id: string
      username: string
      name: string
      email: string
      role: string
    }
  }
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any
    //@ts-ignore
    readonly zod: FastifyZod<typeof models>
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string
      email: string
      name: string
      username: string
      role: string
    }
  }
}
