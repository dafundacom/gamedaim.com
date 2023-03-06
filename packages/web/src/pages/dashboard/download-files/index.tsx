import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import useSWR from "swr"
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
import { DownloadFileDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"

export default function DownloadFilesDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalDownloadFiles, setTotalDownloadFiles]: any = React.useState()

  const { downloadFiles } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/download-file/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, downloadFiles: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/download-file/count`, fetcher, {
    onSuccess: (data) => {
      setTotalDownloadFiles(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/download-file/${item.id}`)

      setPost((prev: any) => ({
        ...prev,
        downloadFiles: downloadFiles.filter(
          (downloadFiles: { id: string }) => downloadFiles.id !== data.id,
        ),
      }))
      toast.success("Files deleted successfully")
      if (router.query.search) {
        mutate()
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalDownloadFiles / 10)

  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/download-files?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/download-file/search/${router.query.search}` : null,
    fetcher,
  )

  return (
    <>
      <NextSeo
        title={`Download-file Dashboard | ${env.SITE_TITLE}`}
        description={`Download-file Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Download File Dashboard | ${env.SITE_TITLE}`,
          description: `Download File Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/download-files/new">
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
            {downloadFiles.length > 0 ? (
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
                      ? searchResult.map(
                          (downloadFile: DownloadFileDataProps) => (
                            <Tr key={downloadFile.id}>
                              <Td className="line-clamp-3 max-w-[120px]">
                                <div className="flex">
                                  <span className="font-medium">
                                    {downloadFile.title}
                                  </span>
                                </div>
                              </Td>
                              <Td className="whitespace-nowrap">
                                <div className="flex">
                                  <span className="font-medium">
                                    {downloadFile.author?.name}
                                  </span>
                                </div>
                              </Td>
                              <Td className="hidden md:!table-cell">
                                {dayjs(downloadFile.createdAt).fromNow()}
                              </Td>
                              <Td className="hidden md:!table-cell">
                                {dayjs(downloadFile.updatedAt).fromNow()}
                              </Td>
                              <Td className="whitespace-nowrap">
                                <div className="flex">
                                  <span className="font-medium">
                                    <Badge variant="outline">
                                      {downloadFile.status}
                                    </Badge>
                                  </span>
                                </div>
                              </Td>
                              <Td align="right">
                                <ActionDashboard
                                  viewLink={`/download-files/${downloadFile.slug}`}
                                  onDelete={() => {
                                    handleDelete(downloadFile)
                                  }}
                                  editLink={`/dashboard/download-files/${downloadFile.id}`}
                                  content={downloadFile.title}
                                />
                              </Td>
                            </Tr>
                          ),
                        )
                      : router.query.search && (
                          <>{`${router.query.search} not found`}</>
                        )}
                    {data &&
                      !router.query.search &&
                      downloadFiles.map(
                        (downloadFile: DownloadFileDataProps) => (
                          <Tr key={downloadFile.id}>
                            <Td className="line-clamp-3 max-w-[120px]">
                              <div className="flex">
                                <span className="font-medium">
                                  {downloadFile.title}
                                </span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  {downloadFile.author.name}
                                </span>
                              </div>
                            </Td>
                            <Td className="hidden md:!table-cell">
                              {dayjs(downloadFile.createdAt).fromNow()}
                            </Td>
                            <Td className="hidden md:!table-cell">
                              {dayjs(downloadFile.updatedAt).fromNow()}
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  <Badge variant="outline">
                                    {downloadFile.status}
                                  </Badge>
                                </span>
                              </div>
                            </Td>
                            <Td align="right">
                              <ActionDashboard
                                onDelete={() => handleDelete(downloadFile)}
                                editLink={`/dashboard/download-files/${downloadFile.id}`}
                                content={downloadFile.title}
                              />
                            </Td>
                          </Tr>
                        ),
                      )}
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
                  Download-files Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}
