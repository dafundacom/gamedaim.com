import { wpFetchAPI } from "./wp-posts"
import { Wp_PrimaryMenus, WP_GetMenusByName } from "@/data/wp-menus"
import { useQuery } from "@tanstack/react-query"
import env from "@/env"

export async function wpGetPrimaryMenus() {
  const data = await wpFetchAPI(Wp_PrimaryMenus)
  const menu = data?.data.menu.menuItems.edges.map(({ node = {} }) => node)

  return {
    menu: Array.isArray(menu) && menu,
  }
}

export async function wpGetMenusByName(id: string) {
  const data = await wpFetchAPI(WP_GetMenusByName, { id })
  const menu = data?.data.menu.menuItems.edges.map(({ node = {} }) => node)

  return {
    menu: Array.isArray(menu) && menu,
  }
}

export const useGetMenusByName = (id: any) => {
  const { data, isError, isFetching } = useQuery(
    ["menus"],
    () => wpGetMenusByName(id),
    {
      staleTime: env.STALE_ONE_DAY,
    },
  )

  return {
    getMenusByName: {
      data: data,
      isError,
      isFetching,
    },
  } as const
}
