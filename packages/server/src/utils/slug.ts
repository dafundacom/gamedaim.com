import { customAlphabet } from "nanoid"

export const uniqueSlug = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)
