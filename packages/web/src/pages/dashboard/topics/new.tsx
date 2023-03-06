import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import useSWR from "swr"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Text,
  Textarea,
} from "ui"

import env from "@/env"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { fetcher } from "@/lib/fetcher"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"

interface FormValues {
  title: string
  description?: string
  meta_title?: string
  meta_description?: string
}

export default function CreateTopicsDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")

  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const { data: medias } = useSWR(`/media/page/1`, fetcher, {
    onSuccess: (data: any) => {
      setLoadedMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    revalidateIfStale: true,
    refreshInterval: 1000,
  })

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await axios.post(
        "/topic",
        selectedFeaturedImageId ? mergedValues : values,
      )
      setSelectedFeaturedImageUrl("")
      setSelectedFeaturedImageId("")
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Topic Successfully created")
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
    setLoading(false)
  }

  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenModal(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Topic | ${env.SITE_TITLE}`}
        description={`Add New Topic | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Add New Topic | ${env.SITE_TITLE}`,
          description: `Add New Topic | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 mb-[100px] flex items-end justify-end">
            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormControl invalid={Boolean(errors.title)}>
                  <FormLabel>
                    Title
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("title", {
                      required: "Title is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Title"
                  />
                  {errors?.title && (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.description)}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register("description")}
                    className="max-w-xl"
                    placeholder="Enter Description (Optional)"
                  />
                  {errors?.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {selectedFeaturedImageId ? (
                  <>
                    <FormLabel>Featured Image</FormLabel>
                    <NextImage
                      src={selectedFeaturedImageUrl}
                      fill
                      alt="Featured Image"
                      className="!relative mt-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                      onClick={() => setOpenModal(true)}
                    />
                  </>
                ) : (
                  <>
                    <FormLabel>Featured Image</FormLabel>
                    <Text
                      size="sm"
                      colorScheme="blue"
                      className="border-1 max-w-xl cursor-pointer rounded-md border-gray-200 p-8 text-center"
                      onClick={() => setOpenModal(true)}
                    >
                      Select Featured Image
                    </Text>
                  </>
                )}
                <FormControl invalid={Boolean(errors.meta_title)}>
                  <FormLabel>Meta Title</FormLabel>
                  <Input
                    type="text"
                    {...register("meta_title")}
                    className="max-w-xl"
                    placeholder="Enter Meta Title (Optional)"
                  />
                  {errors?.meta_title && (
                    <FormErrorMessage>
                      {errors.meta_title.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.meta_description)}>
                  <FormLabel>Meta Description</FormLabel>
                  <Textarea
                    type="text"
                    {...register("meta_description")}
                    className="max-w-xl"
                    placeholder="Enter Meta Description (Optional)"
                  />
                  {errors?.meta_description && (
                    <FormErrorMessage>
                      {errors.meta_description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Submit
                </Button>
              </form>
              <Modal
                title="Select Featured Image"
                content={
                  <>
                    <MediaUpload addLoadMedias={setLoadedMedias} />
                    <div className="my-3">
                      {medias && (
                        <InfiniteScrollMedia
                          medias={loadedMedias}
                          index={2}
                          updateMedia={handleUpdateMedia}
                          totalPage={totalPageMedias}
                        />
                      )}
                    </div>
                  </>
                }
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
