import * as React from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"
import { Heading, Text } from "ui"
import { ListDownload } from "@/components/List"
import { DropdownLink } from "@/components/Dropdown/DropdownLink"
import { SearchInput } from "@/components/Search"
import { getDownloadByType, getDownloads } from "@/lib/download"
import { DownloadCard } from "@/components/Card"
import { getTopics } from "@/lib/topics"

import env from "@/env"
import { HomeLayout } from "@/layouts/Home"
import { DownloadDataProps, TopicDataProps } from "@/lib/data-types"
import { getSettingsSite } from "@/lib/settings"
interface DownloadProps {
  downloads: DownloadDataProps
  apps: DownloadDataProps
  games: DownloadDataProps
  topics: TopicDataProps[]
  settingsSite: any
}
export default function Download(props: DownloadProps) {
  const { downloads, apps, games, topics, settingsSite } = props
  const router = useRouter()

  return (
    <>
      <NextSeo
        title={`Download | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={settingsSite.description?.value || env.DESCRIPTION}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Download | ${settingsSite.title?.value || env.SITE_TITTLE}`,
          description: settingsSite.description?.value || env.DESCRIPTION,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: settingsSite.url?.value || env.DOMAIN,
            item: `https://${settingsSite.url?.value || env.DOMAIN}`,
          },
          {
            position: 2,
            name: "Download",
            item: `https://${settingsSite.url?.value || env.DOMAIN}${
              router.pathname
            }`,
          },
        ]}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full flex-col min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
          <div className="flex flex-col rounded-md bg-gray-100 p-5 dark:bg-gray-800">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <DropdownLink list={topics} title={"Category"} />
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
              <NextLink href="/download/game/">
                <Text size="sm" colorScheme="blue">
                  See more
                </Text>
              </NextLink>
            </div>
            <ListDownload listDownloads={games?.downloadByType} />
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Apps
              </Heading>
              <NextLink href="/download/app/">
                <Text size="sm" colorScheme="blue">
                  See more
                </Text>
              </NextLink>
            </div>
            <ListDownload listDownloads={apps?.downloadByType} />
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-start"}>
              <Heading as="h2" size="2xl" bold>
                Newest
              </Heading>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <DownloadCard list={downloads} />
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export async function getStaticProps() {
  const { downloads } = await getDownloads()

  const apps = await getDownloadByType("App")
  const { topics } = await getTopics(1)
  const games = await getDownloadByType("Game")
  const { settingsSite } = await getSettingsSite()

  return {
    props: { downloads, apps, games, topics, settingsSite },
  }
}
