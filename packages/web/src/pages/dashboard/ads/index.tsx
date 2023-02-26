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
import useSWR from "swr"
import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { ActionDashboard } from "@/components/Action"
import { AdminRole } from "@/components/Role"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { DashboardLayout } from "@/layouts/Dashboard"
import { AdDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"

export default function AdsDashboard() {
  const [ad, setAd] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalAds, setTotalAds]: any = React.useState()
  const { ads } = ad

  const router = useRouter()
  dayjs.extend(relativeTime)
  const { data } = useSWR(`/ad/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setAd((prev: any) => ({ ...prev, ads: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/ad/count`, fetcher, {
    onSuccess: (data) => {
      setTotalAds(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/ad/${item.id}`)

      setAd((prev: any) => ({
        ...prev,
        ads: ads.filter((ad: { id: string }) => ad.id !== data.id),
      }))
      toast.success("Ads deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalAds / 10)

  return (
    <>
      <NextSeo
        title={`Ad Dashboard | ${env.SITE_TITLE}`}
        description={`Ad Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
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
            {data && ads.length > 0 ? (
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
                    {data &&
                      ads.map((ad: AdDataProps) => (
                        <Tr key={ad.id}>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">{ad.title}</span>
                            </div>
                          </Td>
                          <Td className="whitespace-nowrap">
                            <div className="flex">
                              <span className="font-medium">{ad.position}</span>
                            </div>
                          </Td>
                          <Td>{dayjs(ad.createdAt).fromNow()}</Td>
                          <Td>{dayjs(ad.updatedAt).fromNow()}</Td>
                          <Td align="right">
                            <ActionDashboard
                              onDelete={() => handleDelete(ad)}
                              editLink={`/dashboard/ads/${ad.id}`}
                              content={ad.title}
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
