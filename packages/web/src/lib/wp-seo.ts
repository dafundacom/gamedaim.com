import axios from "axios"
import env from "@/env"

export async function getSeoDatas(url: string) {
  const headers = { "Content-Type": "application/json" }

  const res = await axios({
    url: env.WP_SEO_API_URL,
    headers: headers,
    params: { url: url },
  })

  return res.data
}
