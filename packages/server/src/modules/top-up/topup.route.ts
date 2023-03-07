import { FastifyInstance } from "fastify"
//@ts-ignore
import Digiflazz from "../../lib/digiflazz"

import {
  checkBalanceHandler,
  priceListPrePaidHandler,
  priceListPostPaidHandler,
  webhookHandler,
  depositHandler,
} from "./top-up.controller"
import { digiflazzHook } from "../../utils/digiflazz"

async function topupRoutes(server: FastifyInstance) {
  server.post(
    "/webhook",
    { preHandler: Digiflazz.webhook(digiflazzHook) },
    webhookHandler,
  )

  server.post("/check-balance", checkBalanceHandler)
  server.post("/price-list-prepaid", priceListPrePaidHandler)
  server.post("/price-list-postpaid", priceListPostPaidHandler)
  server.post("/deposit", depositHandler)
}

export default topupRoutes
