import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { Button, IconButton, Text } from "ui"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"

import env from "@/env"
import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ContentContext } from "@/contexts/content.context"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"

export default function TopicsDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalTopics, setTotalTopics]: any = React.useState()

  const { topics } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["topics", page],
    queryFn: () => getTopics(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, topics: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const topicsCount: any = useQuery({
    queryKey: ["topicsCount"],
    queryFn: () => getTopicsCount(),
    onSuccess: (data) => {
      setTotalTopics(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getTopicsCount = async () => {
    const { data } = await axios.get("/topic/count")
    return data
  }

  const getTopics = async (page: number) => {
    const { data } = await axios.get(`/topic/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/topic/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        topics: topics.filter(
          (topic: { id: string }) => topic.id !== datas.data.id,
        ),
      }))
      toast.success("Topic deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = topicsCount.isSuccess && Math.ceil(totalTopics / 10)

  return (
    <>
      <NextSeo
        title={`Topic Dashboard | ${env.SITE_TITLE}`}
        description={`Topic Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Topic Dashboard | ${env.SITE_TITLE}`,
          description: `Topic Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/topics/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {topics.length > 0 ? (
              <>
                <Table>
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isFetching === false &&
                      topics.map(
                        (
                          topic: {
                            id: string
                            title: string
                            slug: string
                            createdAt: string
                            updatedAt: string
                          },
                          i: number,
                        ) => (
                          <Tr key={i}>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  {topic.title}
                                </span>
                              </div>
                            </Td>
                            <Td>{dayjs(topic.createdAt).fromNow()}</Td>
                            <Td>{dayjs(topic.updatedAt).fromNow()}</Td>
                            <Td align="right">
                              <ActionDashboard
                                viewLink={`/topic/${topic.slug}`}
                                onDelete={() => mutationDelete.mutate(topic)}
                                editLink={`/dashboard/topics/${topic.id}`}
                                content={topic.title}
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
                      {topicsCount.isFetching === false &&
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
                  Topics Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
