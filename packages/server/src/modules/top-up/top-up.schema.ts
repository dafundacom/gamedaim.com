import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const TRANSCACTION_TYPE = ["inq-pasca", "pay-pasca", "status-pasca", null]

const depositInput = {
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(2),
  bank: z
    .string({
      required_error: "Bank is required",
      invalid_type_error: "Bank must be a string",
    })
    .min(2),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2),
}

const transactionInput = {
  sku: z
    .string({
      required_error: "Sku is required",
      invalid_type_error: "Sku must be a string",
    })
    .min(2),
  customerNo: z
    .string({
      required_error: "Customer Nomer is required",
      invalid_type_error: "Customer Nomer must be a string",
    })
    .min(2),
  refId: z
    .string({
      required_error: "Ref ID is required",
      invalid_type_error: "Ref ID must be a string",
    })
    .min(2),
  testing: z
    .boolean({
      invalid_type_error: "Testing must be a boolean",
    })
    .optional(),
  msg: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .min(2),
  cmd: z
    .any()
    .refine(
      (cmd) => TRANSCACTION_TYPE.includes(cmd),
      "your transaction type doesnt exist on available option.",
    ),
}

const plnCheckInput = {
  customerNo: z
    .string({
      required_error: "Customer Nomer is required",
      invalid_type_error: "Customer Nomer must be a string",
    })
    .min(2),
}

const transactionCounterInput = {
  sku: z
    .string({
      required_error: "SKU is required",
      invalid_type_error: "SKU must be a string",
    })
    .min(2),
}

const transactionCounterGenerated = {
  id: z.string(),
  transactions: z.number(),
}

const transactionCounterResponseSchema = z.object({
  ...transactionCounterInput,
  ...transactionCounterGenerated,
})

const createDepositSchema = z.object({
  ...depositInput,
})

const createTransactionSchema = z.object({
  ...transactionInput,
})

const createPlnCheckSchema = z.object({
  ...plnCheckInput,
})

const createTransactionCounterSchema = z.object({
  ...transactionCounterInput,
})

export type CreateDepositInput = z.infer<typeof createDepositSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type CreatePlnCheckInput = z.infer<typeof createPlnCheckSchema>
export type CreateTransactionCounterInput = z.infer<
  typeof createTransactionCounterSchema
>

const models = {
  createDepositSchema,
  createTransactionSchema,
  createPlnCheckSchema,
  createTransactionCounterSchema,
  transactionCounterResponseSchema,
}

export const { schemas: topUpSchemas, $ref } = buildJsonSchemas(models, {
  // @ts-ignore
  $id: "TopUpSchema",
})
