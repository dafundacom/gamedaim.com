import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { IconButton, Text } from "ui"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

import env from "@/env"
import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ContentContext } from "@/contexts/content.context"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function WpCommentsDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalWpComments, setTotalWpComments]: any = React.useState()

  const { wpComments } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["wpComments", page],
    queryFn: () => getWpComments(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, wpComments: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const wpCommentsCount: any = useQuery({
    queryKey: ["wpCommentsCount"],
    queryFn: () => getWpCommentsCount(),
    onSuccess: (data) => {
      setTotalWpComments(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getWpCommentsCount = async () => {
    const { data } = await axios.get("/wp-comment/count")
    return data
  }

  const getWpComments = async (page: number) => {
    const { data } = await axios.get(`/wp-comment/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/wp-comment/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        wpComments: wpComments.filter(
          (wpComment: { id: string }) => wpComment.id !== datas.data.id,
        ),
      }))
      toast.success("WpComment deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = wpCommentsCount.isSuccess && Math.ceil(totalWpComments / 10)

  return (
    <>
      <NextSeo
        title={`WP Comment Dashboard | ${env.SITE_TITLE}`}
        description={`WP Comment Dashboard | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `WP Comment Dashboard | ${env.SITE_TITLE}`,
          description: `WP Comment Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="my-6 rounded">
            {wpComments.length > 0 ? (
              <>
                <Table>
                  <Thead>
                    <Tr isTitle>
                      <Th>Content</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th className="!text-center">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {wpComments && (
                      <>
                        {isFetching === false &&
                          wpComments.map(
                            (
                              wpComment: {
                                id: string
                                content: string
                                createdAt: string
                                updatedAt: string
                              },
                              i: number,
                            ) => (
                              <Tr key={i}>
                                <Td className="whitespace-nowrap">
                                  <div className="flex">
                                    <span className="font-medium">
                                      {wpComment.content}
                                    </span>
                                  </div>
                                </Td>
                                <Td>{dayjs(wpComment.createdAt).fromNow()}</Td>
                                <Td>{dayjs(wpComment.updatedAt).fromNow()}</Td>
                                <Td align="right">
                                  <ActionDashboard
                                    onDelete={() =>
                                      mutationDelete.mutate(wpComment)
                                    }
                                  />
                                </Td>
                              </Tr>
                            ),
                          )}
                      </>
                    )}
                  </Tbody>
                </Table>

                {page && (
                  <div className="flex justify-center items-center align-center mt-2 space-x-2">
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
                      {wpCommentsCount.isFetching === false &&
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
              <div className="flex items-center justify-center my-48">
                <Text size="4xl" as="h3" className="text-center font-bold">
                  WP Comments Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
