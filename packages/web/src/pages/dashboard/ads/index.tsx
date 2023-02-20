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

export default function AdsDashboard() {
  const [ad, setAd] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalAds, setTotalAds]: any = React.useState()

  const { ads } = ad

  const router = useRouter()
  dayjs.extend(relativeTime)

  const { isFetching }: any = useQuery({
    queryKey: ["ads", page],
    queryFn: () => getAds(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setAd((prev: any) => ({ ...prev, ads: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const adsCount: any = useQuery({
    queryKey: ["adsCount"],
    queryFn: () => getAdsCount(),
    onSuccess: (data) => {
      setTotalAds(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getAdsCount = async () => {
    const { data } = await axios.get("/ad/count")
    return data
  }

  const getAds = async (page: number) => {
    const { data } = await axios.get(`/ad/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/ad/${item.id}`)
    },
    onSuccess: (datas) => {
      setAd((prev: any) => ({
        ...prev,
        ads: ads.filter((ad: { id: string }) => ad.id !== datas.data.id),
      }))
      toast.success("Ads deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = adsCount.isSuccess && Math.ceil(totalAds / 10)

  return (
    <>
      <NextSeo
        title={`Ad Dashboard | ${env.SITE_TITLE}`}
        description={`Ad Dashboard | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Ad Dashboard | ${env.SITE_TITLE}`,
          description: `Ad Dashboard | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/ads/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          <div className="my-6 rounded">
            {ads.length > 0 ? (
              <>
                <Table>
                  <Thead>
                    <Tr isTitle>
                      <Th>Title</Th>
                      <Th>Position</Th>
                      <Th>Published Date</Th>
                      <Th>Last Modified</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isFetching === false &&
                      ads.map(
                        (
                          ad: {
                            id: string
                            title: string
                            position: string
                            createdAt: string
                            updatedAt: string
                          },
                          i: number,
                        ) => (
                          <Tr key={i}>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">{ad.title}</span>
                              </div>
                            </Td>
                            <Td className="whitespace-nowrap">
                              <div className="flex">
                                <span className="font-medium">
                                  {ad.position}
                                </span>
                              </div>
                            </Td>
                            <Td>{dayjs(ad.createdAt).fromNow()}</Td>
                            <Td>{dayjs(ad.updatedAt).fromNow()}</Td>
                            <Td align="right">
                              <ActionDashboard
                                onDelete={() => mutationDelete.mutate(ad)}
                                editLink={`/dashboard/ads/${ad.id}`}
                                content={ad.title}
                              />
                            </Td>
                          </Tr>
                        ),
                      )}
                  </Tbody>
                </Table>
                {page && (
                  <div className="flex justify-center items-center align-center mt-2 space-x-2">
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
                      {adsCount.isFetching === false && page !== lastPage && (
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
              <div className="flex items-center justify-center my-48">
                <Text size="4xl" as="h3" className="text-center font-bold">
                  Ads Not found
                </Text>
              </div>
            )}
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
