import { FastifyInstance } from "fastify"
import { $ref } from "./top-up.schema"
// import Digiflazz from "../../lib/digiflazz"

import {
  checkBalanceHandler,
  priceListPrePaidHandler,
  priceListPostPaidHandler,
  webhookHandler,
  depositHandler,
  transactionHandler,
  plnCheckHandler,
} from "./top-up.controller"
// import { digiflazzHook } from "../../utils/digiflazz"

async function topupRoutes(server: FastifyInstance) {
  server.post("/webhook", webhookHandler)

  server.post("/check-balance", checkBalanceHandler)
  server.post("/price-list-prepaid", priceListPrePaidHandler)
  server.post("/price-list-postpaid", priceListPostPaidHandler)
  server.post(
    "/deposit",
    {
      schema: {
        body: $ref("createDepositSchema"),
      },
    },
    depositHandler,
  )

  server.post(
    "/transaction",
    {
      schema: {
        body: $ref("createTransactionSchema"),
      },
    },
    transactionHandler,
  )
  server.post(
    "/pln-check",
    {
      schema: {
        body: $ref("createPlnCheckSchema"),
      },
    },
    plnCheckHandler,
  )
}

export default topupRoutes
