import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { MdAdd } from "react-icons/md"
import { Badge, Button } from "ui"

import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function UsersDashboard() {
  const [post, setPost] = React.useContext(ContentContext)

  const { users } = post

  dayjs.extend(relativeTime)

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/user/page/1")
      setPost((prev: any) => ({ ...prev, users: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/user/${item.id}`)
      setPost((prev: any) => ({
        ...prev,
        users: users.filter((user: { id: string }) => user.id !== data.id),
      }))
      toast.success("User deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/users/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="my-6 rounded">
          <Table>
            <Thead>
              <Tr isTitle>
                <Th>Username</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Date Joined</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(
                (
                  user: {
                    id: string
                    slug: string
                    username: string
                    name: string
                    email: string
                    role: string
                    createdAt: string
                  },
                  i: number,
                ) => (
                  <Tr key={i}>
                    <Td className="whitespace-nowrap">
                      <div className="flex">
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div className="flex">
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div className="flex">
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div className="flex">
                        <span className="font-medium">
                          <Badge variant="outline">{user.role}</Badge>
                        </span>
                      </div>
                    </Td>
                    <Td>{dayjs(user.createdAt).fromNow()}</Td>
                    <Td align="right">
                      <ActionDashboard
                        viewLink={`/user/${user.slug}`}
                        onDelete={() => handleDelete(user)}
                        editLink={`/dashboard/users/${user.id}`}
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
