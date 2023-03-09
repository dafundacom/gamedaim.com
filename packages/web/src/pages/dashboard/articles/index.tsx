import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import env from "@/env"

import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineSearch,
} from "react-icons/md"
import { Badge, Button, IconButton, Input, Text } from "ui"

import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { ArticleDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"
import { getSettingsSite } from "@/lib/settings"

export default function ArticlesDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [content, setContent] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalArticles, setTotalArticles] = React.useState<number>(0)

  const { articles } = content

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/article/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setContent((prev: any) => ({ ...prev, articles: data }))
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

      setContent((prev: any) => ({
        ...prev,
        articles: articles.filter((ad: { id: string }) => ad.id !== data.id),
      }))
      toast.success("Articles deleted successfully")
      if (router.query.search) {
        mutate()
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalArticles / 10)
  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/articles?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/article/search/${router.query.search}` : null,
    fetcher,
  )

  return (
    <>
      <NextSeo
        title={`Article Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Article Dashboard | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Article Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Article Dashboard | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/articles/new">
                <Button leftIcon={<MdAdd />}>Add New</Button>
              </NextLink>
            </div>

            <form onSubmit={(e: any) => handleSearch(e)}>
              <Input.Group className="max-w-[200px]">
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
          <div className="mb-[100px] mt-6 rounded">
            {articles.length > 0 ? (
              <>
                <Table className="!table-fixed	border-collapse border-spacing-0">
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Author</Th>
                      <Th className="hidden md:table-cell">Published Date</Th>
                      <Th className="hidden md:table-cell">Last Modified</Th>
                      <Th className="hidden md:table-cell">Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {router.query.search &&
                    searchResult &&
                    searchResult.length > 0
                      ? searchResult.map((article: ArticleDataProps) => (
                          <Tr key={article.id}>
                            <Td className="line-clamp-3 max-w-[120px]">
                              <div className="flex">
                                <span className="font-medium">
                                  {article.title}
                                </span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                {/* <span className="font-medium">
                                  {article.author.name}
                                </span> */}
                              </div>
                            </Td>
                            <Td className="hidden md:table-cell">
                              {dayjs(article.createdAt).fromNow()}
                            </Td>
                            <Td className="hidden md:table-cell">
                              {dayjs(article.updatedAt).fromNow()}
                            </Td>
                            <Td className="hidden whitespace-nowrap md:table-cell">
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
                                onDelete={() => {
                                  handleDelete(article)
                                }}
                                editLink={`/dashboard/articles/${article.id}`}
                                content={article.title}
                              />
                            </Td>
                          </Tr>
                        ))
                      : router.query.search && (
                          <>{`${router.query.search} not found`}</>
                        )}
                    {data &&
                      !router.query.search &&
                      articles.map((article: ArticleDataProps) => (
                        <Tr key={article.id}>
                          <Td className="line-clamp-3 max-w-[120px]">
                            <div>
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
                          <Td className="hidden md:table-cell">
                            {dayjs(article.createdAt).fromNow()}
                          </Td>
                          <Td className="hidden md:table-cell">
                            {dayjs(article.updatedAt).fromNow()}
                          </Td>
                          <Td className="hidden whitespace-nowrap md:table-cell">
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
                {page && articles && articles.length > 0 && (
                  <div className="align-center mt-2 flex items-center justify-center space-x-2">
                    <>
                      {page !== 1 && !router.query.search && (
                        <IconButton
                          onClick={() => setPage((old) => Math.max(old - 1, 0))}
                          disabled={page === 1}
                          className="!rounded-full !px-0"
                        >
                          <MdChevronLeft />
                        </IconButton>
                      )}
                      {count && page !== lastPage && !router.query.search && (
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

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
