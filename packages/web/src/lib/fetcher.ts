import axios from "axios"
import env from "@/env"
import type { AxiosError, AxiosRequestConfig } from "axios"

export const fetcher = (url: string) => axios.get(url).then((res) => res.data)
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

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export const http = async <T>(
  method: Method,
  config?: AxiosRequestConfig,
): Promise<[T | null, null | AxiosError<T, T>]> => {
  try {
    const res = await axios<T>({ ...config, method })
    return [res.data as T, null]
  } catch (err) {
    return [null, err as AxiosError<T, T>]
  }
}

export const getDatas = async (path: string) => {
  const [res, err] = await http<any>("GET", { url: env.API + path })
  if (err !== null) {
    return null
  }
  return res
}
