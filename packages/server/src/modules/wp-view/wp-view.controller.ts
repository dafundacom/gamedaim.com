import { FastifyReply, FastifyRequest } from "fastify"

import { UpdateWpViewInput } from "./wp-view.schema"
import { getWpView, getWpViews, updateWpViewCount } from "./wp-view.service"

export async function updateWpViewHandler(
  request: FastifyRequest<{ Body: UpdateWpViewInput }>,
  reply: FastifyReply,
) {
  try {
    const { wpPostId } = request.body

    const setting = await updateWpViewCount(wpPostId)

    return reply.code(201).send(setting)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getWpViewsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const wpViews = await getWpViews()
    return reply.code(201).send(wpViews)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getWpViewHandler(
  request: FastifyRequest<{ Params: UpdateWpViewInput }>,
  reply: FastifyReply,
) {
  try {
    const { wpPostId } = request.params
    const setting = await getWpView(wpPostId)
    return reply.code(201).send(setting)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
