import db from "../../utils/db"
import { CreateTransactionCounterInput } from "./top-up.schema"

export async function createTransactionCounter(
  data: CreateTransactionCounterInput,
) {
  const { sku } = data

  return await db.transactionCounter.upsert({
    where: { sku: sku },
    update: {
      transactions: { increment: 1 },
    },
    create: {
      sku: sku,
      transactions: 1,
    },
  })
}

export async function findTransactionCounterBySku(transactionSku: string) {
  return await db.transactionCounter.findUnique({
    where: { sku: transactionSku },
    select: {
      id: true,
      sku: true,
      transactions: true,
    },
  })
}
