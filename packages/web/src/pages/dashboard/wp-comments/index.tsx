import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"

import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ArticleContext } from "@/contexts/article.context"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function WpCommentsDashboard() {
  const [post, setPost] = React.useContext(ArticleContext)

  const { wpComments } = post

  dayjs.extend(relativeTime)

  const getWpComments = async () => {
    try {
      const { data } = await axios.get("/wp-comment/page/1")
      setPost((prev: any) => ({ ...prev, wpComments: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getWpComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/wp-comment/${item.id}`)
      setPost((prev: any) => ({
        ...prev,
        wpComments: wpComments.filter(
          (wpComment: { id: string }) => wpComment.id !== data.id,
        ),
      }))
      toast.success("Comment deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <AdminRole>
      <DashboardLayout>
        <div className="my-6 rounded">
          <Table>
            <Thead>
              <Tr isTitle>
                <Th>Content</Th>
                <Th>Published Date</Th>
                <Th>Last Modified</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {wpComments.map(
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
                        <span className="font-medium">{wpComment.content}</span>
                      </div>
                    </Td>
                    <Td>{dayjs(wpComment.createdAt).fromNow()}</Td>
                    <Td>{dayjs(wpComment.updatedAt).fromNow()}</Td>
                    <Td align="right">
                      <ActionDashboard
                        onDelete={() => handleDelete(wpComment)}
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
