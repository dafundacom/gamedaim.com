import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import useSWR from "swr"
import { NextSeo } from "next-seo"
import { IconButton, Text } from "ui"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import env from "@/env"

import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ContentContext } from "@/contexts/content.context"
import { DashboardLayout } from "@/layouts/Dashboard"
import { CommentDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"
import { getSettingsSite } from "@/lib/settings"

export default function CommentsDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalComments, setTotalComments]: any = React.useState()

  const { comments } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/comment/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, comments: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { data: count } = useSWR(`/comment/count`, fetcher, {
    onSuccess: (data) => {
      setTotalComments(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async (item: { id: any }) => {
    try {
      const { data } = await axios.delete(`/comment/${item.id}`)

      setPost((prev: any) => ({
        ...prev,
        comments: comments.filter(
          (comments: { id: string }) => comments.id !== data.id,
        ),
      }))
      toast.success("User deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalComments / 10)

  return (
    <>
      <NextSeo
        title={`Comment Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Comment Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Comment Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Comment Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="my-6 rounded">
            {comments.length > 0 ? (
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
                    {comments && (
                      <>
                        {data &&
                          comments.map((comment: CommentDataProps) => (
                            <Tr key={comment.id}>
                              <Td className="whitespace-nowrap">
                                <div className="flex">
                                  <span className="font-medium">
                                    {comment.content}
                                  </span>
                                </div>
                              </Td>
                              <Td>{dayjs(comment.createdAt).fromNow()}</Td>
                              <Td>{dayjs(comment.updatedAt).fromNow()}</Td>
                              <Td align="center">
                                <ActionDashboard
                                  onDelete={() => handleDelete(comment)}
                                />
                              </Td>
                            </Tr>
                          ))}
                      </>
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
                  Comments Not found
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
