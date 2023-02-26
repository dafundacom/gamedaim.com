import * as React from "react"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { Heading } from "ui"
import env from "@/env"
import { ListDownload, ListDownloadCategory } from "@/components/List"
import { DropdownLink } from "@/components/Dropdown/DropdownLink"
import { SearchInput } from "@/components/Search"
import { getDownloadByType, getDownloads } from "@/lib/download"
import { DownloadCard } from "@/components/Card"
import { getTopics } from "@/lib/topics"
import { HomeLayout } from "@/layouts/Home"
import { DownloadDataProps, TopicDataProps } from "@/lib/data-types"

interface GameProps {
  downloads: DownloadDataProps
  games: DownloadDataProps
  topics: TopicDataProps[]
}
export default function Game(props: GameProps) {
  const { downloads, games, topics } = props
  const router = useRouter()

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
                <DropdownLink list={topics} title={"Category"} />
                <DropdownLink list={topics} title={"Platform"} />
              </div>
              <div>
                <SearchInput />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <Heading>Pilih Kategori</Heading>
              </div>
              <ListDownloadCategory listCategories={topics} />
            </div>
          </div>

          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-start"}>
              <Heading as="h2" size="2xl" bold>
                Games
              </Heading>
            </div>

            <ListDownload listDownloads={games?.downloadByType} />
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-start"}>
              <Heading as="h2" size="2xl" bold>
                Newest
              </Heading>
            </div>
            <div className="flex flex-wrap gap-4">
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

  const games = await getDownloadByType("Game")
  const { topics } = await getTopics(1)

  return {
    props: { downloads, games, topics },
  }
}
