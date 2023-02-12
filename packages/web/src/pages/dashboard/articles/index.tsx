import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Badge, Button, IconButton } from "ui"

import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"

export default function ArticlesDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalArticles, setTotalArticles]: any = React.useState()

  const { articles } = post

  dayjs.extend(relativeTime)
  const { isFetching }: any = useQuery({
    queryKey: ["articles", page],
    queryFn: () => getArticles(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, articles: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const articlesCount: any = useQuery({
    queryKey: ["articlesCount"],
    queryFn: () => getArticlesCount(),
    onSuccess: (data) => {
      setTotalArticles(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getArticlesCount = async () => {
    const { data } = await axios.get("/article/count")
    return data
  }
  const getArticles = async (page: number) => {
    const { data } = await axios.get(`/article/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/article/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        articles: articles.filter(
          (article: { id: string }) => article.id !== datas.data.id,
        ),
      }))
      toast.success("Article deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const lastPage = articlesCount.isSuccess && Math.ceil(totalArticles / 10)

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/articles/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="my-6 rounded">
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
                articles.map(
                  (
                    article: {
                      id: string
                      title: string
                      slug: string
                      author: {
                        name: string
                      }
                      status: string
                      createdAt: string
                      updatedAt: string
                    },
                    i: number,
                  ) => (
                    <Tr key={i}>
                      <Td className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">{article.title}</span>
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">
                            {article.author.name}
                          </span>
                        </div>
                      </Td>
                      <Td>{dayjs(article.createdAt).fromNow()}</Td>
                      <Td>{dayjs(article.updatedAt).fromNow()}</Td>
                      <Td className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">
                            <Badge variant="outline">{article.status}</Badge>
                          </span>
                        </div>
                      </Td>
                      <Td align="right">
                        <ActionDashboard
                          viewLink={`/article/${article.slug}`}
                          onDelete={() => mutationDelete.mutate(article)}
                          editLink={`/dashboard/articles/${article.id}`}
                        />
                      </Td>
                    </Tr>
                  ),
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
                {articlesCount.isFetching === false && page !== lastPage && (
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
        </div>
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
