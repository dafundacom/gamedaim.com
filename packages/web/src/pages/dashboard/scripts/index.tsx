import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { Button, IconButton, Text } from "ui"
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md"
import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getScriptsCount } from "@/lib/script"

export default function ScriptsDashboard() {
  const [script, setScript] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalScripts, setTotalScripts]: any = React.useState()

  const { scripts } = script

  const router = useRouter()
  dayjs.extend(relativeTime)
  const getScripts = async (page: number) => {
    let scriptsData
    try {
      const { data } = await axios.get(`/script/page/${page}`)
      scriptsData = data
    } catch (e) {
      console.log(`Failed to query post data: ${e}`)
      throw e
    }

    return { scripts: scriptsData }
  }

  const { isFetching }: any = useQuery({
    queryKey: ["scripts", page],
    queryFn: () => getScripts(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      if (data?.scripts) {
        setScript((prev: any) => ({ ...prev, scripts: data?.scripts }))
      }
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const scriptsCount: any = useQuery({
    queryKey: ["scriptsCount"],
    queryFn: () => getScriptsCount(),
    onSuccess: (data) => {
      setTotalScripts(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/script/${item.id}`)
    },
    onSuccess: (datas) => {
      setScript((prev: any) => ({
        ...prev,
        scripts: scripts.filter(
          (script: { id: string }) => script.id !== datas.data.id,
        ),
      }))
      toast.success("Scripts deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = scriptsCount.isSuccess && Math.ceil(totalScripts / 10)

  return (
    <>
      <NextSeo
        title={`Script Dashboard | ${env.SITE_TITLE}`}
        description={`Script Dashboard | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
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
          <div className="my-6 rounded">
            {scripts.length > 0 ? (
              <>
                <Table>
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Active</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isFetching === false &&
                      scripts.map(
                        (
                          script: {
                            id: string
                            title: string
                            active: boolean
                            createdAt: string
                            updatedAt: string
                          },
                          i: number,
                        ) => (
                          <Tr key={i}>
                            <Td className="whitespace-nowrap">
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
                            <Td>{dayjs(script.createdAt).fromNow()}</Td>
                            <Td>{dayjs(script.updatedAt).fromNow()}</Td>
                            <Td align="right">
                              <ActionDashboard
                                onDelete={() => mutationDelete.mutate(script)}
                                editLink={`/dashboard/scripts/${script.id}`}
                                content={script.title}
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
                      {scriptsCount.isFetching === false &&
                        page !== lastPage && (
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
