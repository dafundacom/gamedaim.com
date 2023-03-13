import * as React from "react"
import NextLink from "next/link"
import dayjs from "dayjs"
import env from "@/env"

import useSWR from "swr"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { Button, IconButton, Input, Text } from "ui"
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineSearch,
} from "react-icons/md"

import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ContentContext } from "@/contexts/content.context"
import { DashboardLayout } from "@/layouts/Dashboard"
import { TopicDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetch"
import { getSettingsSite } from "@/lib/settings"
import { fetch } from "@/lib/fetch"

export default function TopicsDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalTopics, setTotalTopics]: any = React.useState()

  const { topics } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/topic/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, topics: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { data: count } = useSWR(`/topic/count`, fetcher, {
    onSuccess: (data) => {
      setTotalTopics(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async (item: { id: any }) => {
    try {
      const { data } = await fetch.delete(`/topic/${item.id}`)

      setPost((prev: any) => ({
        ...prev,
        topics: topics.filter((topic: { id: string }) => topic.id !== data.id),
      }))
      toast.success("Topic deleted successfully")
      if (router.query.search) {
        mutate()
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalTopics / 10)

  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/topics?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/topic/search/${router.query.search}` : null,
    fetcher,
  )

  return (
    <>
      <NextSeo
        title={`Topic Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Topic Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Topic Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Topic Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/topics/new">
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
            {topics.length > 0 ? (
              <>
                <Table className="!table-fixed border-collapse border-spacing-0">
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {router.query.search &&
                    searchResult &&
                    searchResult.length > 0
                      ? searchResult.map((topic: TopicDataProps) => (
                          <Tr key={topic.id}>
                            <Td className="line-clamp-3 max-w-[120px]">
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
                                viewLink={`/topics/${topic.slug}`}
                                onDelete={() => {
                                  handleDelete(topic)
                                }}
                                editLink={`/dashboard/topics/${topic.id}`}
                                content={topic.title}
                              />
                            </Td>
                          </Tr>
                        ))
                      : router.query.search && (
                          <>{`${router.query.search} not found`}</>
                        )}
                    {data &&
                      !router.query.search &&
                      topics.map((topic: TopicDataProps) => (
                        <Tr key={topic.id}>
                          <Td className="line-clamp-3 max-w-[120px]">
                            <div className="flex">
                              <span className="font-medium">{topic.title}</span>
                            </div>
                          </Td>
                          <Td>{dayjs(topic.createdAt).fromNow()}</Td>
                          <Td>{dayjs(topic.updatedAt).fromNow()}</Td>
                          <Td align="right">
                            <ActionDashboard
                              viewLink={`/topic/${topic.slug}`}
                              onDelete={() => handleDelete(topic)}
                              editLink={`/dashboard/topics/${topic.id}`}
                              content={topic.title}
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
export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
