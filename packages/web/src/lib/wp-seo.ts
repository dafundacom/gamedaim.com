import axios from "axios"
import { useQuery } from "@tanstack/react-query"
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
export const useGetSeoData = (url: any) => {
  const { data, isError, isFetching } = useQuery(
    ["seo", url],
    () => getSeoDatas(url),
    {
      staleTime: env.STALE_ONE_DAY,
    },
  )

  return {
    getSeo: {
      data: data,
      isError,
      isFetching,
    },
  } as const
}
