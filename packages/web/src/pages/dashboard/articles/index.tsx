import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Badge, Button, IconButton, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { ArticleDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"

export default function ArticlesDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalArticles, setTotalArticles]: any = React.useState()

  const { articles } = post

  const router = useRouter()
  dayjs.extend(relativeTime)
  const { data } = useSWR(`/article/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, articles: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/article/count`, fetcher, {
    onSuccess: (data) => {
      setTotalArticles(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/article/${item.id}`)
      console.log(data)

      setPost((prev: any) => ({
        ...prev,
        articles: articles.filter((ad: { id: string }) => ad.id !== data.id),
      }))
      toast.success("Articles deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalArticles / 10)

  return (
    <>
      <NextSeo
        title={`Article Dashboard | ${env.SITE_TITLE}`}
        description={`Article Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Article Dashboard | ${env.SITE_TITLE}`,
          description: `Article Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/articles/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {articles.length > 0 ? (
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
                    {data &&
                      articles.map((article: ArticleDataProps) => (
                        <Tr key={article.id}>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">
                                {article.title}
                              </span>
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
                                <Badge variant="outline">
                                  {article.status}
                                </Badge>
                              </span>
                            </div>
                          </Td>
                          <Td align="right">
                            <ActionDashboard
                              viewLink={`/article/${article.slug}`}
                              onDelete={() => handleDelete(article)}
                              editLink={`/dashboard/articles/${article.id}`}
                              content={article.title}
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
                  Articles Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}
