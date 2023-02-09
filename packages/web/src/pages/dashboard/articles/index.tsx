import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { MdAdd } from "react-icons/md"
import { Badge, Button } from "ui"

import { ArticleContext } from "@/contexts/article.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function ArticlesDashboard() {
  const [post, setPost] = React.useContext(ArticleContext)

  const { articles } = post

  dayjs.extend(relativeTime)

  const getArticles = async () => {
    try {
      const { data } = await axios.get("/article/page/1")
      setPost((prev: any) => ({ ...prev, articles: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/article/${item.id}`)
      setPost((prev: any) => ({
        ...prev,
        articles: articles.filter(
          (article: { id: string }) => article.id !== data.id,
        ),
      }))
      toast.success("Article deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

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
              {articles.map(
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
                        onDelete={() => handleDelete(article)}
                        editLink={`/dashboard/articles/${article.id}`}
                      />
                    </Td>
                  </Tr>
                ),
              )}
            </Tbody>
          </Table>
        </div>
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
