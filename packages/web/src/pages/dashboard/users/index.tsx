import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Badge, Button, IconButton, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminOrAuthorRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"

export default function UsersDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalUsers, setTotalUsers]: any = React.useState()

  const { users } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, users: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const usersCount: any = useQuery({
    queryKey: ["usersCount"],
    queryFn: () => getUsersCount(),
    onSuccess: (data) => {
      setTotalUsers(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getUsersCount = async () => {
    const { data } = await axios.get("/user/count")
    return data
  }

  const getUsers = async (page: number) => {
    const { data } = await axios.get(`/user/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/user/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        users: users.filter(
          (user: { id: string }) => user.id !== datas.data.id,
        ),
      }))
      toast.success("User deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = usersCount.isSuccess && Math.ceil(totalUsers / 10)

  return (
    <>
      <NextSeo
        title={`User Dashboard | ${env.SITE_TITLE}`}
        description={`User Dashboard | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `User Dashboard | ${env.SITE_TITLE}`,
          description: `User Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/users/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {users.length > 0 ? (
              <>
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
                    {isFetching === false &&
                      users.map(
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
                                <span className="font-medium">
                                  {user.username}
                                </span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  {user.email}
                                </span>
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
                                onDelete={() => mutationDelete.mutate(user)}
                                editLink={`/dashboard/users/${user.id}`}
                              />
                            </Td>
                          </Tr>
                        ),
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
                      {usersCount.isFetching === false && page !== lastPage && (
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
                  Users Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}
