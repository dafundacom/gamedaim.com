import * as React from "react"
import NextLink from "next/link"
import toast from "react-hot-toast"
import useSWR from "swr"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdAdd } from "react-icons/md"
import { Button, Text } from "ui"

import env from "@/env"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { fetcher } from "@/lib/fetcher"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"

export default function MediaLibraryDashboard() {
  const [medias, setMedias] = React.useState([])
  const router = useRouter()
  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)
  const { data } = useSWR(`/media/page/1`, fetcher, {
    onSuccess: (data) => {
      setMedias(data)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

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
              <div className="my-3">
                {data && (
                  <InfiniteScrollMedia
                    medias={medias}
                    index={2}
                    isLibrary={true}
                    totalPage={totalPageMedias}
                  />
                )}
              </div>
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
