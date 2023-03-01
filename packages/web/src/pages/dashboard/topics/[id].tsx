import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import { useRouter } from "next/router"
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
  slug: string
  description?: string
  meta_title?: string
  meta_description?: string
}

export default function EditTopicDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [topic, setTopic] = React.useState<any>({
    id: "",
    title: "",
    slug: "",
    description: "",
    meta_title: "",
    meta_description: "",
  })

  const router = useRouter()
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

  React.useEffect(() => {
    loadTopic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  React.useEffect(() => {
    reset(topic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic])

  const loadTopic = async () => {
    try {
      const { data } = await axios.get(`/topic/${router.query.id}`)
      setTopic({
        id: data.id,
        title: data.title,
        meta_title: data.meta_title,
        slug: data.slug,
        meta_description: data.meta_description,
      })
      setSelectedFeaturedImageId(data.featuredImage.id)
      setSelectedFeaturedImageUrl(data.featuredImage.url)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await axios.put(
        `/topic/${topic.id}`,
        selectedFeaturedImageId ? mergedValues : values,
      )

      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Topic updated successfully")
        setLoading(false)
        router.push(`/dashboard/topics`)
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
      setLoading(false)
    }
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
        title={`Edit Topic | ${env.SITE_TITLE}`}
        description={`Edit Topic | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Edit Topic | ${env.SITE_TITLE}`,
          description: `Edit Topic | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
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
                  />
                  {errors?.title && (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.slug)}>
                  <FormLabel>
                    Slug
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("slug", {
                      required: "Slug is Required",
                    })}
                    className="max-w-xl"
                  />
                  {errors?.slug && (
                    <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
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
