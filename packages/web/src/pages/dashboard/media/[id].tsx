import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Textarea,
} from "ui"

import env from "@/env"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

interface FormValues {
  name: string
  url: string
  alt: string
  description: string
}

export default function EditMediaDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [media, setMedia] = React.useState<any>({
    id: "",
    name: "",
    url: "",
    alt: "",
    description: "",
  })

  const router = useRouter()

  React.useEffect(() => {
    loadMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  React.useEffect(() => {
    reset(media)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media])

  const loadMedia = async () => {
    try {
      const { data } = await axios.get(`/media/${router.query.id}`)
      setMedia({
        id: data.id,
        name: data.name,
        url: data.url,
        alt: data.alt,
        description: data.description,
      })
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
    try {
      setLoading(true)
      const { data } = await axios.put(`/media/${media.id}`, values)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Media updated successfully")
        setLoading(false)
        router.push(`/dashboard/media`)
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
      setLoading(false)
    }
  }

  return (
    <>
      <NextSeo
        title={`Edit Media | ${env.SITE_TITLE}`}
        description={`Edit Media | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Edit Media | ${env.SITE_TITLE}`,
          description: `Edit Media | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex justify-between space-x-8">
            <div>
              <NextImage
                src={media.url}
                alt={media.alt}
                fill
                className="!relative max-h-[500px] max-w-[500px] rounded-sm border-2 border-gray-300 object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormControl invalid={Boolean(errors.name)}>
                  <FormLabel>
                    Name
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("name", {
                      required: "Name is Required",
                    })}
                    className="max-w-xl"
                  />
                  {errors?.name && (
                    <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  type="text"
                  disabled
                  className="max-w-xl"
                  {...register("url")}
                />
                <FormControl invalid={Boolean(errors.alt)}>
                  <FormLabel>Alt</FormLabel>
                  <Input
                    type="text"
                    {...register("alt")}
                    className="max-w-xl"
                  />
                  {errors?.alt && (
                    <FormErrorMessage>{errors.alt.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.description)}>
                  <FormLabel>Description</FormLabel>
                  <Textarea {...register("description")} className="max-w-xl" />
                  {errors?.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Save
                </Button>
              </form>
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
