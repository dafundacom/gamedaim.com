import * as React from "react"
import NextLink from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import useSWR from "swr"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineSearch,
} from "react-icons/md"
import { Badge, Button, IconButton, Input, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { DownloadDataProps } from "@/lib/data-types"
import { fetch, fetcher } from "@/lib/fetch"
import { getSettingsSite } from "@/lib/settings"

export default function DownloadsDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalDownloads, setTotalDownloads]: any = React.useState()

  const { downloads } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/download/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, downloads: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/download/count`, fetcher, {
    onSuccess: (data) => {
      setTotalDownloads(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await fetch.delete(`/download/${item.id}`)

      setPost((prev: any) => ({
        ...prev,
        downloads: downloads.filter(
          (downloads: { id: string }) => downloads.id !== data.id,
        ),
      }))
      toast.success("Downloads deleted successfully")
      if (router.query.search) {
        mutate()
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalDownloads / 10)

  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/downloads?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/download/search/${router.query.search}` : null,
    fetcher,
  )

  return (
    <>
      <NextSeo
        title={`Download Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Download Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Download Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Download Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/downloads/new">
                <Button leftIcon={<MdAdd />}>Add New</Button>
              </NextLink>
            </div>

            <form onSubmit={(e: any) => handleSearch(e)}>
              <Input.Group>
                <Input type="text" name="search" />
                <Input.RightElement className="w-2">
                  <button
                    type="submit"
                    className="inset-y-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none"
                  >
                    <MdOutlineSearch />
                  </button>
                </Input.RightElement>
              </Input.Group>
            </form>
          </div>
          <div className="mb-[80px] mt-6 rounded">
            {downloads.length > 0 ? (
              <>
                <Table className="!table-fixed border-collapse border-spacing-0">
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Author</Th>
                      <Th className="hidden md:!table-cell">Published Date</Th>
                      <Th className="hidden md:!table-cell">Last Modified</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {router.query.search &&
                    searchResult &&
                    searchResult.length > 0
                      ? searchResult.map((download: DownloadDataProps) => (
                          <Tr key={download.id}>
                            <Td className="line-clamp-3 max-w-[120px]">
                              <div className="flex">
                                <span className="font-medium">
                                  {download.title}
                                </span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  {download.author?.name}
                                </span>
                              </div>
                            </Td>
                            <Td className="hidden md:!table-cell">
                              {dayjs(download.createdAt).fromNow()}
                            </Td>
                            <Td className="hidden md:!table-cell">
                              {dayjs(download.updatedAt).fromNow()}
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  <Badge variant="outline">
                                    {download.status}
                                  </Badge>
                                </span>
                              </div>
                            </Td>
                            <Td align="right">
                              <ActionDashboard
                                viewLink={`/downloads/${download.slug}`}
                                onDelete={() => {
                                  handleDelete(download)
                                }}
                                editLink={`/dashboard/downloads/${download.id}`}
                                content={download.title}
                              />
                            </Td>
                          </Tr>
                        ))
                      : router.query.search && (
                          <>{`${router.query.search} not found`}</>
                        )}
                    {data &&
                      !router.query.search &&
                      downloads.map((download: DownloadDataProps) => (
                        <Tr key={download.id}>
                          <Td className="line-clamp-3 max-w-[120px]">
                            <div className="flex">
                              <span className="font-medium">
                                {download.title}
                              </span>
                            </div>
                          </Td>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">
                                {download.author.name}
                              </span>
                            </div>
                          </Td>
                          <Td className="hidden md:!table-cell">
                            {dayjs(download.createdAt).fromNow()}
                          </Td>
                          <Td className="hidden md:!table-cell">
                            {dayjs(download.updatedAt).fromNow()}
                          </Td>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">
                                <Badge variant="outline">
                                  {download.status}
                                </Badge>
                              </span>
                            </div>
                          </Td>
                          <Td align="right">
                            <ActionDashboard
                              // @ts-ignore FIX:later
                              viewLink={`/download/${download.type.toLowerCase()}/${
                                download.slug
                              }`}
                              onDelete={() => handleDelete(download)}
                              editLink={`/dashboard/downloads/${download.id}`}
                              content={download.title}
                            />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {page && !router.query.search && (
                  <div className="align-center mt-2 flex items-center justify-center space-x-2">
                    <>
                      {page !== 1 && (
                        <IconButton
                          onClick={() => setPage((old) => Math.max(old - 1, 0))}
                          disabled={page === 1}
                          className="!rounded-full !px-0"
                        >
                          <MdChevronLeft />
                        </IconButton>
                      )}
                      {count && page !== lastPage && (
                        <IconButton
                          onClick={() => {
                            setPage((old) => old + 1)
                          }}
                          className="!rounded-full !px-0"
                        >
                          <MdChevronRight />
                        </IconButton>
                      )}
                    </>
                  </div>
                )}
              </>
            ) : (
              <div className="my-48 flex items-center justify-center">
                <Text size="4xl" as="h3" className="text-center font-bold">
                  Downloads Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
