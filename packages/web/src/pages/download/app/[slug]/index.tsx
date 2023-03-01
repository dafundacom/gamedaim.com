import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import dynamic from "next/dynamic"
import dayjs from "dayjs"
import parse from "html-react-parser"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  NextSeo,
  SoftwareAppJsonLd,
} from "next-seo"
import { HiChip } from "react-icons/hi"
import {
  MdCode,
  MdChevronRight,
  MdUpdate,
  MdCategory,
  MdFolder,
  MdVpnKey,
} from "react-icons/md"
import { Breadcrumb, Button, Heading, Text } from "ui"

import env from "@/env"
import { getDownloadBySlug, getDownloadByType } from "@/lib/download"
import { DownloadFileDataProps } from "@/lib/data-types"
import { HomeLayout } from "@/layouts/Home"
import axios from "axios"
import { parseAndSplitHTMLString } from "@/utils/split-html"
import { PopupAd } from "@/components/Ads/PopupAd"

const DownloadCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.DownloadCardSide),
)

const ListDownload = dynamic(() =>
  import("@/components/List").then((mod) => mod.ListDownload),
)
const SpecBox = dynamic(() =>
  import("@/components/Box").then((mod) => mod.SpecBox),
)

export default function DownloadApp(props: { download: any; downloads: any }) {
  const { download, downloads } = props
  dayjs.extend(relativeTime)

  const [ad, setAd]: any = React.useState()
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadingAd, setLoadingAd] = React.useState(false)

  const adAbove: any = ad?.filter(
    (ads: any) => ads.position == "SINGLE_DOWNLOAD_ABOVE",
  )
  const adBelow: any = ad?.filter(
    (ads: any) => ads.position == "SINGLE_DOWNLOAD_BELOW",
  )
  const adInline: any = ad?.filter(
    (ads: any) => ads.position == "SINGLE_DOWNLOAD_INLINE",
  )
  const adPopup: any = ad?.filter(
    (ads: any) => ads.position == "SINGLE_DOWNLOAD_POP_UP",
  )

  const { firstHalf, secondHalf } = parseAndSplitHTMLString(download.content)

  const getAds = async () => {
    try {
      const { data } = await axios.get("/ad/page/1")
      setAd(data)
      setLoadingAd(true)
    } catch (err: any) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    getAds()
    setOpenModal(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fileVersion =
    download.downloadFiles.length > 0 && download?.downloadFiles[0]

  return (
    <>
      <NextSeo
        title={`${download.meta_title || download.title} | ${env.SITE_TITLE}`}
        description={download.meta_description || download.excerpt}
        canonical={`https://${env.DOMAIN}/download/app/${download.slug}`}
        openGraph={{
          url: `https://${env.DOMAIN}/download/app/${download.slug}`,
          title: `${download.meta_title || download.title} | ${env.SITE_TITLE}`,
          description: download.meta_description || download.excerpt,
        }}
      />
      <ArticleJsonLd
        url={`https://${env.DOMAIN}/download/app/${download.slug}`}
        title={`${download.meta_title || download.title} | ${env.SITE_TITLE}`}
        images={[download.featuredImage.url]}
        datePublished={download.createdAt}
        dateModified={download.createdAt}
        authorName={[
          {
            name: env.SITE_TITLE,
            url: `https://${env.DOMAIN}`,
          },
        ]}
        publisherName={env.SITE_TITLE}
        publisherLogo={env.LOGO_URL}
        description={download.meta_description || download.excerpt}
        isAccessibleForFree={true}
      />
      <SoftwareAppJsonLd
        name={download.meta_title || download.title}
        price={download.downloadFiles[0]?.price}
        priceCurrency={download.downloadFiles[0]?.currency}
        aggregateRating={{ ratingValue: "5.0", reviewCount: "1" }}
        operatingSystem={download.operationSystem}
        applicationCategory={download.schemaType}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: env.DOMAIN,
            item: `https://${env.DOMAIN}`,
          },
          {
            position: 2,
            name: "Download",
            item: `https://${env.DOMAIN}/download/`,
          },
          {
            position: 3,
            name: download.type,
            item: `https://${env.DOMAIN}/download/${download.type.toString()}`,
          },
          {
            position: 4,
            name: download.topics && download.topics[0]?.title,
            item:
              download.topics &&
              `https://${env.DOMAIN}/download/topic/${download.topics[0]?.slug}`,
          },
        ]}
      />
      <HomeLayout>
        {loadingAd === true &&
          ad.length > 0 &&
          adPopup.length > 0 &&
          openModal === true && (
            <PopupAd
              content={<>{parse(adPopup[0]?.content)}</>}
              isOpen={openModal}
              className="max-w-[366px]"
              onClose={() => setOpenModal(false)}
            />
          )}
        <section className="flex w-full flex-col">
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col overflow-x-hidden px-4 lg:mr-4">
              <Breadcrumb
                className="dark:text-gray-200"
                separator={<MdChevronRight />}
              >
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/download/app">App</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href={`/${download?.slug}`}>
                    {download?.title}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <div
                className={"my-5 flex flex-col space-x-2 space-y-2 lg:flex-row"}
              >
                <div className={"w-full space-y-4"}>
                  <div
                    id="download"
                    className="rounded-xl bg-white p-7 shadow-md dark:bg-gray-800"
                  >
                    <div className={"flex space-x-6"}>
                      <div className={"w-2/12 "}>
                        <NextImage
                          height={200}
                          width={200}
                          src={download?.featuredImage.url}
                          alt={download?.title}
                          className="rounded-lg"
                        />
                      </div>
                      <div className={"w-10/12 space-y-1"}>
                        <Heading
                          as="h2"
                          lineClamp={1}
                          className="text-xl md:text-3xl"
                        >
                          {download?.title}
                        </Heading>

                        <div className="flex flex-wrap gap-2">
                          {download.downloadFiles.length > 0 && (
                            <>
                              <Text>{fileVersion.version}</Text>
                              <NextLink
                                href={`/download/app/${download.slug}#all-version`}
                                className="text-green-400"
                              >
                                Show All Version
                              </NextLink>
                            </>
                          )}
                        </div>

                        <Text>{download?.developer}</Text>
                        <div className={"inline-flex space-x-2 pt-12"}>
                          <Button colorScheme="gray">
                            <a href={download?.officialWeb} target="_blank">
                              Official Web
                            </a>
                          </Button>
                          {download.downloadFiles.length > 0 && (
                            <NextLink
                              href={`/download/app/${download.slug}/${fileVersion.slug}`}
                            >
                              <Button colorScheme="primary">Download</Button>
                            </NextLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 dark:text-gray-200">
                    {loadingAd === true &&
                      ad.length > 0 &&
                      adAbove.length > 0 &&
                      adAbove.map((ad: { content: string }) => {
                        return (
                          <div className="my-2 rounded p-2">
                            {parse(ad?.content)}
                          </div>
                        )
                      })}
                    {parse(firstHalf)}
                    {loadingAd === true &&
                      ad.length > 0 &&
                      adInline.length > 0 &&
                      adInline.map((ad: { content: string }) => {
                        return (
                          <div className="my-2 rounded p-2">
                            {parse(ad?.content)}
                          </div>
                        )
                      })}
                    {parse(secondHalf)}
                    {loadingAd === true &&
                      ad.length > 0 &&
                      adBelow.length > 0 &&
                      adBelow.map((ad: { content: string }) => {
                        return (
                          <div className="my-2 rounded p-2">
                            {parse(ad?.content)}
                          </div>
                        )
                      })}
                  </div>
                  <div className="grid grid-cols-3 grid-rows-2 rounded-lg bg-white shadow dark:bg-gray-800">
                    <SpecBox
                      icon={HiChip}
                      title="Sistem Operasi"
                      value={download?.operationSystem}
                    />
                    <SpecBox
                      icon={MdCode}
                      title="Developer"
                      value={download?.developer}
                    />
                    <SpecBox
                      icon={MdCategory}
                      title="Category"
                      value={download.topics && download.topics[0]?.title}
                    />
                    <SpecBox
                      icon={MdUpdate}
                      title="Last Update"
                      value={dayjs(download?.updatedAt).fromNow()}
                    />
                    {download.downloadFiles.length > 0 && (
                      <SpecBox
                        icon={MdFolder}
                        title="File Size"
                        value={fileVersion.fileSize}
                      />
                    )}
                    <SpecBox
                      icon={MdVpnKey}
                      title="License"
                      value={download?.license}
                    />
                  </div>

                  <div id="all-version" className="space-y-2">
                    <Heading>All version</Heading>
                    <div className="grid grid-cols-3 grid-rows-2 gap-4 rounded-lg bg-white dark:bg-gray-800">
                      {download.downloadFiles.length > 0 &&
                        download.downloadFiles.map(
                          (downloadFile: DownloadFileDataProps) => {
                            return (
                              <div className="cursor-pointer rounded bg-gray-200 p-2 shadow-md dark:bg-gray-800">
                                <NextLink
                                  href={`/download/app/${download.slug}/${downloadFile.slug}`}
                                >
                                  <Text>{downloadFile.version}</Text>
                                  <Text>{downloadFile.title}</Text>
                                  <Text>{downloadFile.fileSize}</Text>
                                  <Text>
                                    {dayjs(downloadFile.createdAt).fromNow()}
                                  </Text>
                                </NextLink>
                              </div>
                            )
                          },
                        )}
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <div className={"my-2 flex flex-row justify-start"}>
                      <Heading as="h2" size="2xl" bold>
                        Related
                      </Heading>
                    </div>
                    {<ListDownload listDownloads={downloads} />}
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
                {downloads.map(
                  (download: {
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
                        key={download.id}
                        src={download.featuredImage?.url}
                        title={download.title}
                        slug={`/download/${download.type.toLowerCase()}/${
                          download.slug
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
  const slug = params.slug

  const { downloadByType } = await getDownloadByType("App")
  const { download } = await getDownloadBySlug(slug)
  if (!download || download.type !== "App") {
    return {
      notFound: true,
    }
  }
  return {
    props: { downloads: downloadByType, download: download },
  }
}
