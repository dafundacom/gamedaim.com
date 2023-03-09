import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useSWR from "swr"

import { HomeLayout } from "@/layouts/Home"
import { fetcher } from "@/lib/fetcher"
import { DownloadCard, DownloadCardSide } from "@/components/Card"
import { getDownloads } from "@/lib/download"
import { DownloadDataProps } from "@/lib/data-types"
import { Breadcrumb } from "ui"
import { MdChevronRight } from "react-icons/md"
import { getSettingsSite } from "@/lib/settings"

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface SearchProps {
  downloads: DownloadDataProps
  settingsSite: any
}

export default function DownloadSearch(props: SearchProps) {
  const { downloads, settingsSite } = props
  const router = useRouter()

  const inputRef = React.useRef() as React.RefObject<HTMLInputElement>

  const { data } = useSWR(`/download/search/${router.query.q}`, fetcher)

  const handlerSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    //@ts-ignore
    const value = inputRef.current.value
    router.push(`/download/search?q=${value}`)
  }

  return (
    <>
      <NextSeo
        title={`Search | ${settingsSite.title?.value || ""}`}
        description={`Search | ${settingsSite.title?.value || ""}`}
        canonical={`https://${settingsSite.url?.value || ""}${router.pathname}`}
        openGraph={{
          url: `https://${settingsSite.url?.value || ""}${router.pathname}`,
          title: `Search | ${settingsSite.title?.value || ""}`,
          description: `Search | ${settingsSite.title?.value || ""}`,
        }}
        noindex={true}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r from-[#1e3799] to-[#0984e3] py-10">
            <div className="absolute top-1 px-4">
              <Breadcrumb
                className="text-white dark:text-gray-200"
                separator={<MdChevronRight className="text-white" />}
              >
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/download/">Download</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link
                    href={`/download/search?q=${router.query?.q}`}
                  >
                    {router.query?.q}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {router.query.q !== undefined || null
                  ? `Search results for "${router.query?.q}"`
                  : "Search"}
              </Heading>
            </div>
          </div>
          <div className="mx-4 flex w-full flex-row px-4 md:mx-auto md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col lg:mr-4">
              <div className="mb-4 rounded-md p-2">
                <form onSubmit={handlerSubmit} autoComplete="off">
                  <div className="relative flex min-w-full lg:w-[400px]">
                    <div className="absolute top-[4px] bottom-0 left-0 flex items-center pl-3">
                      <span className="text-gray-4 h-5 w-5"></span>
                    </div>
                    <input
                      className="focus:border-primary-200 h-11 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-gray-500"
                      type="search"
                      name="q"
                      ref={inputRef}
                      autoComplete="off"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="w-full px-4">
                {data && data.length > 0 ? (
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <DownloadCard list={data} />
                  </div>
                ) : (
                  <>
                    <div>
                      {router.query?.q} not found. Please try with another
                      keyword
                    </div>
                  </>
                )}
              </div>
            </div>
            <aside className="hidden w-4/12 lg:block">
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

export async function getServerSideProps() {
  const { downloads } = await getDownloads()
  const { settingsSite } = await getSettingsSite()

  return { props: { downloads, settingsSite } }
}
