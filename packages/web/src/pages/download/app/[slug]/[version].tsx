import * as React from "react"
import NextImage from "next/image"
import dynamic from "next/dynamic"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  NextSeo,
  SoftwareAppJsonLd,
} from "next-seo"
import { MdChevronRight } from "react-icons/md"
import { Breadcrumb, Button, Heading, Text } from "ui"

import parse from "html-react-parser"
import env from "@/env"
import { getDownloadBySlug, getDownloads } from "@/lib/download"
import { getDownloadFileBySlug } from "@/lib/download-file"
import { HomeLayout } from "@/layouts/Home"
import axios from "axios"
const DownloadCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.DownloadCardSide),
)
const CounterDownload = dynamic(() =>
  import("@/components/Counter").then((mod) => mod.CounterDownload),
)
const ListDownload = dynamic(() =>
  import("@/components/List").then((mod) => mod.ListDownload),
)

export default function DownloadAppVersion(props: {
  download: any
  downloadFile: any
  downloads: any
}) {
  const { downloadFile, download, downloads } = props
  dayjs.extend(relativeTime)

  const [showCountdown, setShowCountdown] = React.useState(false)
  const [countdownInterval, setCountdownInterval] = React.useState<any>(null)

  const [ad, setAd]: any = React.useState()
  const [loadingAd, setLoadingAd] = React.useState(false)

  const adAbove: any = ad?.filter(
    (ads: any) => ads.position == "DOWNLOADING_PAGE",
  )

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [countdownInterval])

  const handleDownloadClick = () => {
    setShowCountdown(true)
    setCountdownInterval(
      setInterval(() => {
        setShowCountdown(false)
        setCountdownInterval(null)
        window.open(downloadFile.downloadLink, "_blank")
      }, 10000),
    )
  }

  return (
    <>
      <NextSeo
        title={`${downloadFile.meta_title || downloadFile.title} | ${
          env.SITE_TITLE
        }`}
        description={download.meta_description || download.excerpt}
        canonical={`https://${env.DOMAIN}/download/app/${download.slug}/${downloadFile.slug}`}
        openGraph={{
          url: `https://${env.DOMAIN}/download/app/${download.slug}/${downloadFile.slug}`,
          title: `${downloadFile.meta_title || downloadFile.title} | ${
            env.SITE_TITLE
          }`,
          description: download.meta_description || download.excerpt,
          images: [
            {
              url: downloadFile.featuredImage.url,
              alt: downloadFile.title,
              width: 1280,
              height: 720,
              type: "image/webp",
            },
          ],
        }}
      />
      <ArticleJsonLd
        url={`https://${env.DOMAIN}/download/app/${download.slug}/${downloadFile.slug}`}
        title={`${downloadFile.meta_title || downloadFile.title} | ${
          env.SITE_TITLE
        }`}
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
        description={download.excerpt}
        isAccessibleForFree={true}
      />
      <SoftwareAppJsonLd
        name={downloadFile.title}
        price={downloadFile?.price}
        priceCurrency={downloadFile?.currency}
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
          {
            position: 5,
            name: download.meta_title || download.title,
            item: `https://${env.DOMAIN}/download/app/${download.slug}`,
          },
        ]}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col overflow-x-hidden px-4 lg:mr-4">
              <Breadcrumb
                className="dark:text-white"
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
                          <Text>{downloadFile.version}</Text>
                        </div>

                        <Text>{download?.developer}</Text>
                        <div className={"inline-flex space-x-2 pt-12"}>
                          <Button
                            onClick={handleDownloadClick}
                            colorScheme="primary"
                            disabled={showCountdown}
                          >
                            Download ({downloadFile.fileSize})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  {showCountdown && (
                    <div className="bg-green-100 p-7 text-black">
                      Link download akan terbuka pada
                      {<CounterDownload />} detik
                    </div>
                  )}

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
  const { downloadFile } = await getDownloadFileBySlug(params.version)
  const { download } = await getDownloadBySlug(params.slug)
  const { downloads } = await getDownloads()
  if (!download || !downloadFile) {
    return {
      notFound: true,
    }
  }
  return {
    props: { downloadFile, download, downloads },
  }
}
