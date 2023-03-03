import { FastifyReply, FastifyRequest } from "fastify"

import { CreateScriptInput, UpdateScriptInput } from "./script.schema"
import {
  createScript,
  deleteScriptById,
  findScriptById,
  getScripts,
  getTotalScripts,
  updateScript,
} from "./script.service"

export async function createScriptHandler(
  request: FastifyRequest<{
    Body: CreateScriptInput & { featuredImageId?: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, content, active } = request.body
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const script = await createScript({
      title,
      content,
      active,
      authorId: user.id,
    })
    return reply.code(201).send(script)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function updateScriptHandler(
  request: FastifyRequest<{
    Params: { scriptId: string }
    Body: UpdateScriptInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { title, content, active } = request.body
    const user = request.user
    const scriptId = request.params.scriptId

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const script = await updateScript(scriptId, {
      title,
      content,
      active,
    })
    return reply.code(201).send(script)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getScriptByIdHandler(
  request: FastifyRequest<{
    Params: { scriptId: string }
  }>,
  reply: FastifyReply,
) {
  try {
    const { scriptId } = request.params
    const script = await findScriptById(scriptId)
    return reply.code(201).send(script)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function deleteScriptHandler(
  request: FastifyRequest<{ Params: { scriptId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { scriptId } = request.params
    const user = request.user
    const deleteScript = await deleteScriptById(scriptId)

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    return reply.code(201).send(deleteScript)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getScriptsHandler(
  request: FastifyRequest<{ Params: { scriptPage: number } }>,
  reply: FastifyReply,
) {
  try {
    const perPage = 10
    const scriptPage = Number(request.params.scriptPage || 1)
    const scripts = await getScripts(scriptPage, perPage)
    return reply.code(201).send(scripts)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getTotalScriptsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user

    if (user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const scripts = await getTotalScripts()
    return reply.code(201).send(scripts)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
