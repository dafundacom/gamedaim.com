//@ts-ignore
import Digiflazz from "../lib/digiflazz"

import env from "../env"

export const digiflazz = new Digiflazz(
  // "weponig14JZW",
  // "dev-15887b10-bc31-11ed-be43-897c133ef6c3",
  env.DIGIFLAZZ_USERNAME,
  env.DIGIFLAZZ_API_KEY_DEV,
)

export const digiflazzHook = new Digiflazz(
  env.DIGIFLAZZ_USERNAME,
  env.DIGIFLAZZ_API_KEY_PROD,
  "superRahasia",
)
