import { FastifyReply, FastifyRequest } from "fastify"

import { digiflazz } from "../../utils/digiflazz-client"
import { CreateDepositInput, CreateTransactionInput } from "./top-up.schema"

export async function webhookHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    console.log("Received webhook:", request.body)

    return reply.code(201).send(request.body)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function checkBalanceHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const balance = await digiflazz.cekSaldo()

    return reply.code(201).send(balance)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function priceListPrePaidHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const priceList = await digiflazz.daftarHarga("prepaid")

    return reply.code(201).send(priceList)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function priceListPostPaidHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const priceList = await digiflazz.daftarHarga("pasca")

    return reply.code(201).send(priceList)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function depositHandler(
  request: FastifyRequest<{
    Body: CreateDepositInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { amount, bank, name } = request.body

    const deposit = await digiflazz.deposit(amount, bank, name)

    return reply.code(201).send(deposit)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function transactionHandler(
  request: FastifyRequest<{
    Body: CreateTransactionInput
  }>,
  reply: FastifyReply,
) {
  try {
    const { sku, customerNo, refId, cmd, testing, msg } = request.body

    const deposit = await digiflazz.transaksi(
      sku,
      customerNo,
      refId,
      cmd,
      testing,
      msg,
    )

    return reply.code(201).send(deposit)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function plnCheckHandler(
  request: FastifyRequest<{
    Body: {
      customerNo: string
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const { customerNo } = request.body

    const deposit = await digiflazz.cekIdPln(customerNo)

    return reply.code(201).send(deposit)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}
