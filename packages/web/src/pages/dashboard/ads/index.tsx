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
import { DashboardLayout } from "@/layouts/Dashboard"
import { AdContext } from "@/contexts/ads.context"

export default function AdsDashboard() {
  const [ad, setAd] = React.useContext(AdContext)

  const { ads } = ad

  dayjs.extend(relativeTime)

  const getAds = async () => {
    try {
      const { data } = await axios.get("/ad/page/1")
      setAd((prev: any) => ({ ...prev, ads: data }))
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getAds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (item: { id: string }) => {
    try {
      const { data } = await axios.delete(`/ad/${item.id}`)
      setAd((prev: any) => ({
        ...prev,
        ads: ads.filter((ad: { id: string }) => ad.id !== data.id),
      }))
      toast.success("Ad deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <AdminRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/ads/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="my-6 rounded">
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
              {ads.map(
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
                        <span className="font-medium">{ad.position}</span>
                      </div>
                    </Td>
                    <Td>{dayjs(ad.createdAt).fromNow()}</Td>
                    <Td>{dayjs(ad.updatedAt).fromNow()}</Td>
                    <Td align="right">
                      <ActionDashboard
                        onDelete={() => handleDelete(ad)}
                        editLink={`/dashboard/ads/${ad.id}`}
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
