import axios from "axios"

export const fetcher = (url: string) => axios.get(url).then((res) => res.data)
export async function fetcherGraphQL(url: any, query: string, variables?: any) {
  const headers = { "Content-Type": "application/json" }

  const res = await axios({
    url: url,
    headers: headers,
    params: { query: query, variables: variables },
  })

  return res.data
}
