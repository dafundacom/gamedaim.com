import Digiflazz from "../lib/digiflazz"

import env from "../env"

export const digiflazz = new Digiflazz(
  env.DIGIFLAZZ_USERNAME,
  env.DIGIFLAZZ_API_KEY_DEV,
)

export const digiflazzHook = new Digiflazz(
  env.DIGIFLAZZ_USERNAME,
  env.DIGIFLAZZ_API_KEY_PROD,
  "superRahasia",
)
