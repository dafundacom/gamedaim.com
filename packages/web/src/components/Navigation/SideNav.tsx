import * as React from "react"
import NextLink from "next/link"
import {
  BiCheckSquare,
  BiListOl,
  BiNews,
  BiStar,
  BiTrophy,
} from "react-icons/bi"
import { FaCoffee } from "react-icons/fa"
import { MdArticle, MdDownload } from "react-icons/md"
import useSWR from "swr"
import { Text } from "ui"

import env from "@/env"
import { WP_GetMenusByName } from "@/data/wp-menus"
import { fetcherGraphQL } from "@/lib/fetcher"

interface SideNavProps {
  primaryMenus?: any
}

export const SideNav = React.forwardRef<HTMLDivElement, SideNavProps>(
  (props, ref) => {
    const { ...rest } = props

    const MENU_PRIMARY = env.MENU_PRIMARY
    const query = {
      query: WP_GetMenusByName,
      variables: { id: MENU_PRIMARY },
    }
    const { data: primarymenu } = useSWR(query, fetcherGraphQL)
    const menu = primarymenu?.menu?.menuItems?.edges.map(
      ({ node = {} }) => node,
    )

    const stylesIcons = "inline-block text-base mr-2"

    return (
      <nav className="relative flex w-full w-56 flex-col" ref={ref} {...rest}>
        <ul className="flex flex-col space-y-3 border-b border-gray-100 p-4 dark:border-gray-700">
          {menu &&
            menu.map((menu: { url: string; label: string }) => {
              const icon = getIcons(menu.label, stylesIcons)
              let domainUrl
              if (menu.url.startsWith("http")) {
                domainUrl = new URL(menu.url)
                domainUrl = domainUrl.origin
              } else {
                domainUrl = ""
              }
              const fullUrl = menu.url.includes(domainUrl)
              let slicedUrl
              if (fullUrl) {
                slicedUrl = menu.url.slice(domainUrl.length + 1)
              }

              return (
                <li key={menu.label}>
                  <NextLink
                    href={`/${fullUrl ? slicedUrl : menu.url}`}
                    className="flex transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
                  >
                    <Text className="hover:text-primary-400 !inline-flex items-center font-bold">
                      {icon} {menu.label}
                    </Text>
                  </NextLink>
                </li>
              )
            })}
        </ul>
        <ul className="flex flex-col space-y-3 border-b border-gray-100 p-4 dark:border-gray-700">
          <li>
            <NextLink
              href="/download"
              className="flex transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
            >
              <Text className="hover:text-primary-400 !inline-flex items-center font-bold">
                <MdDownload className={stylesIcons} />
                Download
              </Text>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/article"
              className="flex transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
            >
              <Text className="hover:text-primary-400 !inline-flex items-center font-bold">
                <MdArticle className={stylesIcons} /> Article
              </Text>
            </NextLink>
          </li>
        </ul>
      </nav>
    )
  },
)

function getIcons(item: string, styles: string | undefined) {
  switch (item) {
    case "Berita":
      return <BiNews className={styles} />
    case "Esports":
      return <BiTrophy className={styles} />
    case "Tips":
      return <FaCoffee className={styles} />
    case "Review":
      return <BiStar className={styles} />
    case "G List":
      return <BiListOl className={styles} />
    case "Tutorial":
      return <BiCheckSquare className={styles} />
    default:
      break
  }
}
