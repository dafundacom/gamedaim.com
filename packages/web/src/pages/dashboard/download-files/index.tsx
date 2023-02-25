import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Badge, Button, IconButton, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DownloadFileDataProps } from "@/lib/data-types"

export default function DownloadFilesDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalDownloadFiles, setTotalDownloadFiles]: any = React.useState()

  const { downloadFiles } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["download-files", page],
    queryFn: () => getDownloadFiles(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, downloadFiles: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const downloadFilesCount: any = useQuery({
    queryKey: ["downloadFilesCount"],
    queryFn: () => getDownloadFilesCount(),
    onSuccess: (data) => {
      setTotalDownloadFiles(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getDownloadFilesCount = async () => {
    const { data } = await axios.get("/download-file/count")
    return data
  }

  const getDownloadFiles = async (page: number) => {
    const { data } = await axios.get(`/download-file/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/download-file/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        downloadFiles: downloadFiles.filter(
          (downloadFile: { id: string }) => downloadFile.id !== datas.data.id,
        ),
      }))
      toast.success("Download-file deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage =
    downloadFilesCount.isSuccess && Math.ceil(totalDownloadFiles / 10)

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
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/download-files/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {downloadFiles.length > 0 ? (
              <>
                <Table>
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Author</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isFetching === false &&
                      downloadFiles.map(
                        (downloadFile: DownloadFileDataProps) => (
                          <Tr key={downloadFile.id}>
                            <Td className="whitespace-nowrap">
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
                            <Td>{dayjs(downloadFile.createdAt).fromNow()}</Td>
                            <Td>{dayjs(downloadFile.updatedAt).fromNow()}</Td>
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
                                onDelete={() =>
                                  mutationDelete.mutate(downloadFile)
                                }
                                editLink={`/dashboard/download-files/${downloadFile.id}`}
                                content={downloadFile.title}
                              />
                            </Td>
                          </Tr>
                        ),
                      )}
                  </Tbody>
                </Table>
                {page && (
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
                      {downloadFilesCount.isFetching === false &&
                        page !== lastPage && (
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
