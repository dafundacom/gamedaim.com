import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import env from "@/env"
import NextLink from "next/link"
import { ListDownload, ListDownloadCategory } from "@/components/List"
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
import { DownloadCard } from "@/components/Card"
import { getTopics, useGetTopics } from "@/lib/topics"
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)

export default function Download() {
  const router = useRouter()

  const { getDownloadsData } = useGetDownloads()
  const { getTopicsData } = useGetTopics()
  const downloadsByGame = useGetDownloadByType("Game")

  return (
    <>
      <NextSeo
        title={`${env.SITE_TITLE} | Everlasting Gaming Knowledge`}
        description={env.DESCRIPTION}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `${env.SITE_TITLE} | Everlasting Gaming Knowledge`,
          description: env.DESCRIPTION,
        }}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full flex-col min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
          <div className="flex flex-col space-y-8 rounded-md bg-gray-100 p-5 dark:bg-gray-800">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <DropdownLink
                  list={getTopicsData?.data?.topics}
                  title={"Category"}
                />
                <DropdownLink
                  list={getTopicsData?.data?.topics}
                  title={"Platform"}
                />
              </div>
              <div>
                <SearchInput />
              </div>
            </div>
            {getTopicsData?.isSuccess && (
              <div>
                <div className="mb-2">
                  <Heading>Pilih Kategori</Heading>
                </div>
                <ListDownloadCategory
                  listCategories={getTopicsData?.data?.topics}
                />
              </div>
            )}
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
                Newest
              </Heading>
              <NextLink href="/download/app/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            <div className="flex flex-wrap gap-4">
              {getDownloadsData?.data !== undefined && (
                <DownloadCard list={getDownloadsData?.data?.downloads} />
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

  await queryClient.prefetchQuery(["downloadType", "Game"], () =>
    getDownloadByType("Game"),
  )
  await queryClient.prefetchQuery(["topics", 1], () => getTopics(1))
  return {
    props: { dehydratedState: dehydrate(queryClient) },
  }
}
