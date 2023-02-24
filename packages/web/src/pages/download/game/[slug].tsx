import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import NextImage from "next/image"
import env from "@/env"
import NextLink from "next/link"
import { ListDownload } from "@/components/List"
import { Breadcrumb, Button, Heading, Text } from "ui"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  useGetDownloads,
  getDownloads,
  useGetDownloadByType,
  getDownloadBySlug,
  useGetDownloadBySlug,
} from "@/lib/download"
import { DownloadCardSide } from "@/components/Card"
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)
import { AiFillStar } from "react-icons/ai"
import { HiChip } from "react-icons/hi"
import {
  MdCode,
  MdChevronRight,
  MdUpdate,
  MdCategory,
  MdFolder,
  MdVpnKey,
} from "react-icons/md"
import { SpecBox } from "@/components/Box"
export default function Download() {
  const router: any = useRouter()
  dayjs.extend(relativeTime)
  const { getDownloadsData } = useGetDownloads()
  const { getDownloadBySlugData } = useGetDownloadBySlug(router.query.slug)
  const downloadsByGame = useGetDownloadByType("Game")
  console.log(getDownloadBySlugData)
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
        <section className="flex w-full flex-col">
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col overflow-x-hidden px-4 lg:mr-4">
              <Breadcrumb separator={<MdChevronRight />}>
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/download/game">Game</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link
                    href={`/${getDownloadBySlugData?.data?.download?.slug}`}
                  >
                    {getDownloadBySlugData?.data?.download?.title}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <div
                className={"my-5 flex flex-col space-x-2 space-y-2 lg:flex-row"}
              >
                <div className={"w-full space-y-4 lg:w-9/12"}>
                  <div className="rounded-xl bg-white p-7 shadow-md dark:bg-gray-800">
                    <div className={"flex space-x-6"}>
                      <div className={"w-2/12 "}>
                        <NextImage
                          height={200}
                          width={200}
                          src={
                            getDownloadBySlugData?.data?.download?.featuredImage
                              .url
                          }
                          alt={getDownloadBySlugData?.data?.download?.title}
                          className="rounded-lg"
                        />
                      </div>
                      <div className={"w-10/12 space-y-1"}>
                        <Heading
                          as="h2"
                          lineClamp={1}
                          className="text-xl md:text-3xl"
                        >
                          {getDownloadBySlugData?.data?.download?.title}
                        </Heading>
                        <span className={"inline-flex align-middle"}>
                          <AiFillStar className={"h-5 w-5 text-green-200"} />
                          <Text>4/5 (33 Reviewer)</Text>
                        </span>
                        <Text>
                          {getDownloadBySlugData?.data?.download?.developer}
                        </Text>
                        <div className={"inline-flex space-x-2 pt-12"}>
                          <Button colorScheme="gray">Official Web</Button>
                          {getDownloadBySlugData?.data?.download?.downloadFiles
                            .length >= 1 && (
                            <NextLink
                              href={
                                getDownloadBySlugData?.data?.download
                                  ?.downloadFiles[0]?.downloadLink
                              }
                            >
                              <Button colorScheme="primary">Download</Button>
                            </NextLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="p-7"
                    dangerouslySetInnerHTML={{
                      __html: getDownloadBySlugData?.data?.download?.content,
                    }}
                  />
                  <div className="grid grid-cols-3 grid-rows-2 rounded-lg bg-white shadow dark:bg-gray-800">
                    <SpecBox
                      icon={HiChip}
                      title="Sistem Operasi"
                      value={
                        getDownloadBySlugData?.data?.download?.operationSystem
                      }
                    />
                    <SpecBox
                      icon={MdCode}
                      title="Developer"
                      value={getDownloadBySlugData?.data?.download?.developer}
                    />
                    <SpecBox icon={MdCategory} title="Category" value={"ss"} />
                    <SpecBox
                      icon={MdUpdate}
                      title="Last Update"
                      value={dayjs(
                        getDownloadBySlugData?.data?.download?.updatedAt,
                      ).fromNow()}
                    />
                    <SpecBox
                      icon={MdFolder}
                      title="File Size"
                      value={
                        getDownloadBySlugData?.data?.download?.downloadFiles[0]
                          .fileSize
                      }
                    />
                    <SpecBox
                      icon={MdVpnKey}
                      title="License"
                      value={getDownloadBySlugData?.data?.download?.license}
                    />
                  </div>
                  <div className="w-full px-4">
                    <div className={"my-2 flex flex-row justify-start"}>
                      <Heading as="h2" size="2xl" bold>
                        Related
                      </Heading>
                    </div>
                    {downloadsByGame?.getDownloadByTypeData?.data !==
                      undefined && (
                      <ListDownload
                        listDownloads={
                          downloadsByGame?.getDownloadByTypeData?.data?.download
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <aside className="hidden w-4/12 px-4 lg:block">
              <div className="sticky top-8 rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-4">
                  <Heading as="h4" className="!text-transparent">
                    <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border after:border-[#1e3799] after:bg-[#1e3799]">
                      Trending
                    </span>
                  </Heading>
                </div>
                {getDownloadsData?.data?.downloads.map(
                  (post: {
                    id: number
                    featuredImage: {
                      url: string
                    }
                    slug: string
                    title: string
                    type: string
                  }) => {
                    return (
                      <DownloadCardSide
                        key={post.id}
                        src={post.featuredImage?.url}
                        title={post.title}
                        slug={`/download/${post.type.toLowerCase()}/${
                          post.slug
                        }`}
                      />
                    )
                  },
                )}
              </div>
            </aside>
          </div>
        </section>
      </HomeLayout>
    </>
  )
}

export async function getServerSideProps({ params }: any) {
  const queryClient = new QueryClient()
  const slug = params.slug
  await queryClient.prefetchQuery(["downloads", 1], () => getDownloads())
  await queryClient.prefetchQuery(["downloadSlug", slug], () =>
    getDownloadBySlug(slug),
  )

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  }
}
