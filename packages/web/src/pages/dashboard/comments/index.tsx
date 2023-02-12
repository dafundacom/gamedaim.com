import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { IconButton, Text } from "ui"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ContentContext } from "@/contexts/content.context"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function CommentsDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalComments, setTotalComments]: any = React.useState()

  const { comments } = post

  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["comments", page],
    queryFn: () => getComments(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, comments: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const commentsCount: any = useQuery({
    queryKey: ["commentsCount"],
    queryFn: () => getCommentsCount(),
    onSuccess: (data) => {
      setTotalComments(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getCommentsCount = async () => {
    const { data } = await axios.get("/comment/count")
    return data
  }

  const getComments = async (page: number) => {
    const { data } = await axios.get(`/comment/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/comment/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        comments: comments.filter(
          (comment: { id: string }) => comment.id !== datas.data.id,
        ),
      }))
      toast.success("Comment deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = commentsCount.isSuccess && Math.ceil(totalComments / 10)

  return (
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
                      {isFetching === false &&
                        comments.map(
                          (
                            comment: {
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
                                    {comment.content}
                                  </span>
                                </div>
                              </Td>
                              <Td>{dayjs(comment.createdAt).fromNow()}</Td>
                              <Td>{dayjs(comment.updatedAt).fromNow()}</Td>
                              <Td align="right">
                                <ActionDashboard
                                  onDelete={() =>
                                    mutationDelete.mutate(comment)
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
                    {commentsCount.isFetching === false &&
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
                Comments Not found
              </Text>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminRole>
  )
}
