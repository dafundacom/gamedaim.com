// TODO: not yet styled
import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import {
  MdAdd,
  MdDeleteOutline,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"
import { Button, IconButton, Text } from "ui"

import { ContentContext } from "@/contexts/content.context"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { useMutation, useQuery } from "@tanstack/react-query"

export default function MediaLibraryDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalMedias, setTotalMedias]: any = React.useState()

  const { medias } = post

  const { isFetching }: any = useQuery({
    queryKey: ["medias", page],
    queryFn: () => getMedias(page),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, medias: data }))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const mediasCount: any = useQuery({
    queryKey: ["mediasCount"],
    queryFn: () => getMediasCount(),
    onSuccess: (data) => {
      setTotalMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const getMediasCount = async () => {
    const { data } = await axios.get("/media/count")
    return data
  }

  const getMedias = async (page: number) => {
    const { data } = await axios.get(`/media/page/${page}`)
    return data
  }

  const mutationDelete: any = useMutation({
    mutationFn: (item: any) => {
      return axios.delete(`/media/${item.id}`)
    },
    onSuccess: (datas) => {
      setPost((prev: any) => ({
        ...prev,
        medias: medias.filter(
          (media: { id: string }) => media.id !== datas.data.id,
        ),
      }))
      toast.success("Media deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const lastPage = mediasCount.isSuccess && Math.ceil(totalMedias / 10)

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/media/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        {medias.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-3">
              {isFetching === false &&
                medias.map(
                  (media: {
                    id: string
                    name: string
                    url: string
                    alt: string
                  }) => (
                    <>
                      <div className="relative">
                        <IconButton
                          colorScheme="red"
                          className="!rounded-full absolute z-20 !p-0"
                          onClick={() => mutationDelete.mutate(media)}
                        >
                          <MdDeleteOutline />
                        </IconButton>
                        <NextLink href={`/dashboard/media/${media.id}`}>
                          <NextImage
                            key={media.id}
                            src={media.url}
                            alt={media.alt}
                            fill
                            className="max-w-[500px] max-h-[500px] object-cover !relative rounded-sm border-2 border-gray-300"
                          />
                        </NextLink>
                      </div>
                    </>
                  ),
                )}
            </div>
            {page && (
              <div className="flex justify-center items-center align-center mt-2 space-x-2">
                {page !== 1 && (
                  <IconButton
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                    disabled={page === 1}
                    className="!rounded-full !px-0"
                  >
                    <MdChevronLeft />
                  </IconButton>
                )}
                {mediasCount.isFetching === false && page !== lastPage && (
                  <IconButton
                    onClick={() => {
                      setPage((old) => old + 1)
                    }}
                    className="!rounded-full !px-0"
                  >
                    <MdChevronRight />
                  </IconButton>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center my-48">
            <Text size="4xl" as="h3" className="text-center font-bold">
              Medias Not found
            </Text>
          </div>
        )}
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
