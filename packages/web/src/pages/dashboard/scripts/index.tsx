import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import useSWR from "swr"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Button, IconButton, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { ScriptDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"

export default function ScriptsDashboard() {
  const [script, setScript] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalScripts, setTotalScripts]: any = React.useState()

  const { scripts } = script

  const router = useRouter()
  dayjs.extend(relativeTime)
  const { data } = useSWR(`/script/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setScript((prev: any) => ({ ...prev, scripts: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/script/count`, fetcher, {
    onSuccess: (data) => {
      setTotalScripts(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { id: any }) => {
    try {
      const { data } = await axios.delete(`/script/${item.id}`)

      setScript((prev: any) => ({
        ...prev,
        scripts: scripts.filter(
          (script: { id: string }) => script.id !== data.id,
        ),
      }))
      toast.success("Script deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalScripts / 10)

  return (
    <>
      <NextSeo
        title={`Script Dashboard | ${env.SITE_TITLE}`}
        description={`Script Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Script Dashboard | ${env.SITE_TITLE}`,
          description: `Script Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/scripts/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="mb-[80px] mt-6 rounded">
            {scripts.length > 0 ? (
              <>
                <Table className="!table-fixed border-collapse border-spacing-0">
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Active</Th>
                      <Th className="hidden md:!table-cell">Published Date</Th>
                      <Th className="hidden md:!table-cell">Last Modified</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data &&
                      scripts.map((script: ScriptDataProps) => (
                        <Tr key={script.id}>
                          <Td className="line-clamp-3 max-w-[120px]">
                            <div className="flex">
                              <span className="font-medium">
                                {script.title}
                              </span>
                            </div>
                          </Td>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">
                                {script.active ? "Yes" : "No"}
                              </span>
                            </div>
                          </Td>
                          <Td className="hidden md:!table-cell">
                            {dayjs(script.createdAt).fromNow()}
                          </Td>
                          <Td className="hidden md:!table-cell">
                            {dayjs(script.updatedAt).fromNow()}
                          </Td>
                          <Td align="right">
                            <ActionDashboard
                              onDelete={() => handleDelete(script)}
                              editLink={`/dashboard/scripts/${script.id}`}
                              content={script.title}
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
                  Scripts Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
