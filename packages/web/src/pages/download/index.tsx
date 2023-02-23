import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import env from "@/env"
import NextLink from "next/link"
import { ListDownload } from "@/components/Download/List"
import { Heading } from "ui"
import { DropdownLink } from "@/components/Dropdown/DropdownLink"
import { SearchInput } from "@/components/Search"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { wpGetMenusByName } from "@/lib/wp-menus"
import {
  getDownloadByType,
  useGetDownloads,
  getDownloads,
  useGetDownloadByType,
} from "@/lib/download"
import { DownloadCard } from "@/components/Download/Card"
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)

export default function Download() {
  const router = useRouter()

  const daftarGames = [
    {
      title: "Red Dead Redemption 2",
      slug: "https://example.com/red-dead-redemption-2",
    },
    {
      title: "The Legend of Zelda: Breath of the Wild",
      slug: "https://example.com/breath-of-the-wild",
    },
    { title: "Grand Theft Auto V", slug: "https://example.com/gta-v" },
    {
      title: "Super Mario Odyssey",
      slug: "https://example.com/super-mario-odyssey",
    },
    { title: "Minecraft", slug: "https://example.com/minecraft" },
    {
      title: "The Witcher 3: Wild Hunt",
      slug: "https://example.com/witcher-3",
    },
    { title: "Overwatch", slug: "https://example.com/overwatch" },
    { title: "Fortnite", slug: "https://example.com/fortnite" },
    {
      title: "League of Legends",
      slug: "https://example.com/league-of-legends",
    },
    { title: "Among Us", slug: "https://example.com/among-us" },
  ]
  const { getDownloadsData } = useGetDownloads()
  const downloadsByApp = useGetDownloadByType("App")
  const downloadsByGame = useGetDownloadByType("Game")
  console.log(getDownloadsData)

  return (
    <>
      <NextSeo
        title={`${env.SITE_TITLE} | Everlasting Gaming Knowledge`}
        description={env.DESCRIPTION}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `${env.SITE_TITLE} | Everlasting Gaming Knowledge`,
          description: env.DESCRIPTION,
        }}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full flex-col min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
          <div className="flex flex-col rounded-md bg-gray-100 p-5 dark:bg-gray-800">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <DropdownLink list={daftarGames} title={"Category"} />
                <DropdownLink list={daftarGames} title={"Platform"} />
              </div>
              <div>
                <SearchInput />
              </div>
            </div>
          </div>

          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Games
              </Heading>
              <NextLink href="/download/game/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            {downloadsByGame?.getDownloadByTypeData?.data !== undefined && (
              <ListDownload
                listDownloads={
                  downloadsByGame?.getDownloadByTypeData?.data?.download
                }
              />
            )}
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Apps
              </Heading>
              <NextLink href="/download/app/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            {downloadsByApp?.getDownloadByTypeData?.data !== undefined && (
              <ListDownload
                listDownloads={
                  downloadsByApp?.getDownloadByTypeData?.data?.download
                }
              />
            )}
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Newest
              </Heading>
              <NextLink href="/download/app/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            <div className="flex flex-wrap gap-4">
              {getDownloadsData?.data !== undefined && (
                <DownloadCard
                  listDownloads={getDownloadsData?.data?.downloads}
                />
              )}
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(["menus"], () =>
    wpGetMenusByName(env.MENU_PRIMARY),
  )
  await queryClient.prefetchQuery(["downloads", 1], () => getDownloads())
  await queryClient.prefetchQuery(["downloadType", "App"], () =>
    getDownloadByType("App"),
  )
  await queryClient.prefetchQuery(["downloadType", "Game"], () =>
    getDownloadByType("Game"),
  )
  return {
    props: { dehydratedState: dehydrate(queryClient) },
  }
}
