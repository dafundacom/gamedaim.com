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
import { DownloadDataProps } from "@/lib/data-types"

export default function DownloadsDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalDownloads, setTotalDownloads]: any = React.useState()

  const { downloads } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["downloads", page],
    queryFn: () => getDownloads(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, downloads: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const downloadsCount: any = useQuery({
    queryKey: ["downloadsCount"],
    queryFn: () => getDownloadsCount(),
    onSuccess: (data) => {
      setTotalDownloads(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getDownloadsCount = async () => {
    const { data } = await axios.get("/download/count")
    return data
  }

  const getDownloads = async (page: number) => {
    const { data } = await axios.get(`/download/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/download/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        downloads: downloads.filter(
          (download: { id: string }) => download.id !== datas.data.id,
        ),
      }))
      toast.success("Download deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = downloadsCount.isSuccess && Math.ceil(totalDownloads / 10)

  return (
    <>
      <NextSeo
        title={`Download Dashboard | ${env.SITE_TITLE}`}
        description={`Download Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Download Dashboard | ${env.SITE_TITLE}`,
          description: `Download Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/downloads/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {downloads.length > 0 ? (
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
                      downloads.map((download: DownloadDataProps) => (
                        <Tr key={download.id}>
                          <Td className="whitespace-nowrap">
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
                          <Td>{dayjs(download.createdAt).fromNow()}</Td>
                          <Td>{dayjs(download.updatedAt).fromNow()}</Td>
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
                              onDelete={() => mutationDelete.mutate(download)}
                              editLink={`/dashboard/downloads/${download.id}`}
                              content={download.title}
                            />
                          </Td>
                        </Tr>
                      ))}
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
                      {downloadsCount.isFetching === false &&
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
