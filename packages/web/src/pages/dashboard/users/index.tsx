import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import useSWR from "swr"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
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
import { UserDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"
import { getSettingsSite } from "@/lib/settings"

export default function UsersDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalUsers, setTotalUsers]: any = React.useState()

  const { users } = post

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { data } = useSWR(`/user/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, users: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { data: count } = useSWR(`/user/count`, fetcher, {
    onSuccess: (data) => {
      setTotalUsers(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async (item: { id: any }) => {
    try {
      const { data } = await axios.delete(`/user/${item.id}`)

      setPost((prev: any) => ({
        ...prev,
        users: users.filter((user: { id: string }) => user.id !== data.id),
      }))
      toast.success("User deleted successfully")
      if (router.query.search) {
        mutate()
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalUsers / 10)
  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/users?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/user/search/${router.query.search}` : null,
    fetcher,
  )
  return (
    <>
      <NextSeo
        title={`User Dashboard | ${settingsSite.title?.value || ""}`}
        description={`User Dashboard | ${settingsSite.title?.value || ""}`}
        canonical={`https://${settingsSite.url?.value || ""}${router.pathname}`}
        openGraph={{
          url: `https://${settingsSite.url?.value || ""}${router.pathname}`,
          title: `User Dashboard | ${settingsSite.title?.value || ""}`,
          description: `User Dashboard | ${settingsSite.title?.value || ""}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/users/new">
                <Button leftIcon={<MdAdd />}>Add New</Button>
              </NextLink>
            </div>

            <form onSubmit={(e: any) => handleSearch(e)}>
              <Input.Group>
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
          <div className="mb-[80px] mt-6 rounded">
            {users.length > 0 ? (
              <>
                <Table className="!table-fixed border-collapse border-spacing-0">
                  <Thead>
                    <Tr isTitle>
                      <Th>Username</Th>
                      <Th>Name</Th>
                      <Th className="hidden md:!table-cell">Email</Th>
                      <Th>Role</Th>
                      <Th className="hidden md:!table-cell">Date Joined</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {router.query.search &&
                    searchResult &&
                    searchResult.length > 0
                      ? searchResult.map((user: UserDataProps) => (
                          <Tr key={user.id}>
                            <Td className="line-clamp-3 max-w-[120px]">
                              <div className="flex">
                                <span className="font-medium">
                                  {user.username}
                                </span>
                              </div>
                            </Td>
                            <Td className="white-space-nowrap">
                              <div className="flex">
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </Td>
                            <Td className="hidden whitespace-nowrap md:!table-cell">
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
                            <Td className="hidden md:!table-cell">
                              {dayjs(user.createdAt).fromNow()}
                            </Td>
                            <Td align="right">
                              <ActionDashboard
                                viewLink={`/user/${user.username}`}
                                onDelete={() => handleDelete(user)}
                                editLink={`/dashboard/users/${user.id}`}
                              />
                            </Td>
                          </Tr>
                        ))
                      : router.query.search && (
                          <>{`${router.query.search} not found`}</>
                        )}
                    {data &&
                      !router.query.search &&
                      users.map((user: UserDataProps) => (
                        <Tr key={user.id}>
                          <Td className="line-clamp-3 max-w-[120px]">
                            <div className="flex">
                              <span className="font-medium">
                                {user.username}
                              </span>
                            </div>
                          </Td>
                          <Td className="white-space-nowrap">
                            <div className="flex">
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </Td>
                          <Td className="hidden whitespace-nowrap md:!table-cell">
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
                          <Td className="hidden md:!table-cell">
                            {dayjs(user.createdAt).fromNow()}
                          </Td>
                          <Td align="right">
                            <ActionDashboard
                              viewLink={`/user/${user.username}`}
                              onDelete={() => handleDelete(user)}
                              editLink={`/dashboard/users/${user.id}`}
                            />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {page && !router.query.search && (
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
                      {count === false && page !== lastPage && (
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
export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
