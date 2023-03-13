import axios from "axios"

import env from "@/env"

export const fetch = axios.create({
  baseURL: env.API,
})

export async function fetcherGraphQL(req: { query: any; variables: any }) {
  const headers = { "Content-Type": "application/json" }
  const { query, variables } = req
  const {
    data: { data },
  } = await axios({
    url: env.WP_API_URL,
    headers: headers,
    params: { query: query, variables: variables },
  })
  return data
}

export const fetcher = (url: string) => fetch.get(url).then((res) => res.data)
