import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import toast from "react-hot-toast"
import useSWR from "swr"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdAdd, MdOutlineSearch } from "react-icons/md"
import { Button, Input, Text } from "ui"

import env from "@/env"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { fetcher } from "@/lib/fetcher"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"
import { MediaDataProps } from "@/lib/data-types"
import axios from "axios"
import { DeleteMediaButton } from "@/components/Media"
import { useInfiniteMedias } from "@/lib/medias"

export default function MediaLibraryDashboard() {
  const router = useRouter()
  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)
  const { medias, page, setPage, updateMedias } = useInfiniteMedias()
  const handleSearch = (e: {
    preventDefault: () => void
    target: { value: any }
  }) => {
    e.preventDefault()
    if (e.target["0"].value.length > 1) {
      router.push(`/dashboard/media/library?search=${e.target["0"].value}`)
    }
  }
  const { data: searchResult, mutate } = useSWR(
    router.query.search ? `/media/search/${router.query.search}` : null,
    fetcher,
  )
  const handleDelete = async (item: { name: any }) => {
    try {
      await axios.delete(`/media/name/${item.name}`)
      mutate()
      toast.success("Media deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

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
          <div className="mt-4 flex items-end justify-between">
            <div>
              <NextLink href="/dashboard/media/new">
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
          {router.query.search && searchResult && searchResult.length > 0 ? (
            <>
              <div className="my-3">
                <div className="mb-4 grid grid-cols-3 gap-3 md:!grid-cols-5">
                  {searchResult &&
                    searchResult.map((media: MediaDataProps) => (
                      <div className="relative overflow-hidden rounded-[18px]">
                        <DeleteMediaButton
                          content={media.name}
                          deleteMedia={() => handleDelete(media)}
                        />
                        <NextLink href={`/dashboard/media/${media.id}`}>
                          <NextImage
                            key={media.id}
                            src={media.url}
                            alt={media.alt || media.name}
                            fill
                            className="loading-image !relative aspect-[1/1] h-[500px] max-w-[unset] rounded-sm border-2 border-gray-300 bg-slate-300 object-cover"
                            onLoadingComplete={(e) => {
                              e.classList.remove("loading-image")
                            }}
                          />
                        </NextLink>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            router.query.search && (
              <div className="my-48 flex items-center justify-center">
                <Text size="4xl" as="h3" className="text-center font-bold">
                  Medias Not found
                </Text>
              </div>
            )
          )}
          {!router.query.search && medias && medias.length > 0 ? (
            <>
              <div className="my-3">
                {medias && (
                  <InfiniteScrollMedia
                    medias={medias}
                    index={2}
                    isLibrary={true}
                    totalPage={totalPageMedias}
                    page={page}
                    setPage={setPage}
                    updateMedia={updateMedias}
                  />
                )}
              </div>
            </>
          ) : (
            !router.query.search && (
              <div className="my-48 flex items-center justify-center">
                <Text size="4xl" as="h3" className="text-center font-bold">
                  Medias Not found
                </Text>
              </div>
            )
          )}
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}
