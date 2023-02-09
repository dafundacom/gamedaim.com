import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { Button } from "ui"
import { MdAdd } from "react-icons/md"

import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ArticleContext } from "@/contexts/article.context"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function TopicsDashboard() {
  const [post, setPost] = React.useContext(ArticleContext)

  const { topics } = post

  dayjs.extend(relativeTime)

  const getTopics = async () => {
    try {
      const { data } = await axios.get("/topic/page/1")
      setPost((prev: any) => ({ ...prev, topics: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getTopics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/topic/${item.id}`)
      setPost((prev: any) => ({
        ...prev,
        topics: topics.filter((topic: { id: string }) => topic.id !== data.id),
      }))
      toast.success("Topic deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <AdminRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/topics/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="my-6 rounded">
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
              {topics.map(
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
                      />
                    </Td>
                  </Tr>
                ),
              )}
            </Tbody>
          </Table>
        </div>
      </DashboardLayout>
    </AdminRole>
  )
}
