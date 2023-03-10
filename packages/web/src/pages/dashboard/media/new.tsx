import * as React from "react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { FormControl, DropZone, FormErrorMessage, Button } from "ui"
import env from "@/env"

import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { resizeImage } from "@/utils/resize-image"
import { getSettingsSite } from "@/lib/settings"
import { fetch } from "@/lib/fetch"

interface FormValues {
  file: Blob
}

export default function UploadMediaDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [loading, setLoading] = React.useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const image = await resizeImage(values.file[0])
      const { data } = await fetch.post(
        "/media/image",
        { image },
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Media Successfully uploaded")
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response)
    }
    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Media | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Add New Media | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Add New Media | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Add New Media | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormControl invalid={Boolean(errors.file)}>
                  <DropZone {...register("file")} />
                  {errors?.file && (
                    <FormErrorMessage>{errors.file.message}</FormErrorMessage>
                  )}
                </FormControl>
                {/* {loading && ( */}
                <div className="align-center flex justify-center">
                  <Button variant="solid" loading={loading}>
                    Submit
                  </Button>
                </div>
                {/* )} */}
              </form>
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
