import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import {
  MdAdd,
  MdDeleteOutline,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"
import { Button, IconButton, Text } from "ui"

import env from "@/env"
import { ContentContext } from "@/contexts/content.context"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { MediaDataProps } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"

export default function MediaLibraryDashboard() {
  const [post, setPost] = React.useContext(ContentContext)
  const [page, setPage] = React.useState(1)
  const [totalMedias, setTotalMedias]: any = React.useState()

  const { medias } = post

  const router = useRouter()

  const { data } = useSWR(`/media/page/${page}`, fetcher, {
    onSuccess: (data) => {
      setPost((prev: any) => ({ ...prev, medias: data }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { data: count } = useSWR(`/media/count`, fetcher, {
    onSuccess: (data) => {
      setTotalMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
  const handleDelete = async (item: { name: any }) => {
    try {
      const { data } = await axios.delete(`/media/name/${item.name}`)

      setPost((prev: any) => ({
        ...prev,
        medias: medias.filter(
          (media: { name: string }) => media.name !== data.name,
        ),
      }))
      toast.success("Media deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  const lastPage = count && Math.ceil(totalMedias / 10)

  return (
    <>
      <NextSeo
        title={`Media Library | ${env.SITE_TITLE}`}
        description={`Media Library | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Media Library | ${env.SITE_TITLE}`,
          description: `Media Library | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <NextLink href="/dashboard/media/new">
              <Button leftIcon={<MdAdd />}>Add New</Button>
            </NextLink>
          </div>
          {medias.length > 0 ? (
            <>
              <div className="my-3 grid grid-cols-2 gap-3 md:grid-cols-5">
                {data &&
                  medias.map((media: MediaDataProps) => (
                    <div className="relative overflow-hidden rounded-[18px]">
                      <IconButton
                        colorScheme="red"
                        className="!absolute z-20 !rounded-full !p-0"
                        onClick={() => handleDelete(media)}
                      >
                        <MdDeleteOutline />
                      </IconButton>
                      <NextLink href={`/dashboard/media/${media.id}`}>
                        <NextImage
                          key={media.id}
                          src={media.url}
                          alt={media.alt}
                          fill
                          className="!relative max-h-[500px] max-w-[500px] rounded-sm border-2 border-gray-300 object-cover"
                        />
                      </NextLink>
                    </div>
                  ))}
              </div>
              {page && (
                <div className="align-center mt-2 flex items-center justify-center space-x-2">
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
                </div>
              )}
            </>
          ) : (
            <div className="my-48 flex items-center justify-center">
              <Text size="4xl" as="h3" className="text-center font-bold">
                Medias Not found
              </Text>
            </div>
          )}
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}
