import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useForm } from "react-hook-form"
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Select,
  Textarea,
} from "ui"

import env from "@/env"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

interface FormValues {
  title: string
  content: string
  active: boolean
  position:
    | "HOME_BELOW_HEADER"
    | "TOPIC_BELOW_HEADER"
    | "ARTICLE_BELOW_HEADER"
    | "DOWNLOAD_BELOW_HEADER"
    | "SINGLE_ARTICLE_ABOVE"
    | "SINGLE_ARTICLE_INLINE"
    | "SINGLE_ARTICLE_BELOW"
    | "SINGLE_ARTICLE_POP_UP"
    | "SINGLE_DOWNLOAD_ABOVE"
    | "SINGLE_DOWNLOAD_INLINE"
    | "SINGLE_DOWNLOAD_BELOW"
    | "SINGLE_DOWNLOAD_POP_UP"
    | "DOWNLOADING_PAGE"
}

export default function CreateAdsDashBoard() {
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
      const { data } = await axios.post("/ad", values)
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Ad Successfully created")
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Ad | ${env.SITE_TITLE}`}
        description={`Add New Ad | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Add New Ad | ${env.SITE_TITLE}`,
          description: `Add New Ad | ${env.SITE_TITLE}`,
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
                <FormControl invalid={Boolean(errors.content)}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    {...register("content")}
                    className="max-w-xl"
                    placeholder="Enter Script"
                  />
                  {errors?.content && (
                    <FormErrorMessage>
                      {errors.content.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.position)}>
                  <FormLabel>
                    Position
                    <RequiredIndicator />
                  </FormLabel>
                  <Select
                    id="position"
                    className="max-w-sm"
                    {...register("position")}
                  >
                    <Select.Option value="HOME_BELOW_HEADER">
                      Home (Below Header)
                    </Select.Option>
                    <Select.Option value="TOPIC_BELOW_HEADER">
                      Topic (Below Header)
                    </Select.Option>
                    <Select.Option value="ARTICLE_BELOW_HEADER">
                      Article (Below Header)
                    </Select.Option>
                    <Select.Option value="DOWNLOAD_BELOW_HEADER">
                      Download (Below Header)
                    </Select.Option>
                    <Select.Option value="SINGLE_ARTICLE_ABOVE">
                      Single Article (Above)
                    </Select.Option>
                    <Select.Option value="SINGLE_ARTICLE_INLINE">
                      Single Article (Inline)
                    </Select.Option>
                    <Select.Option value="SINGLE_ARTICLE_BELOW">
                      Single Article (Below)
                    </Select.Option>
                    <Select.Option value="SINGLE_ARTICLE_POP_UP">
                      Single Article (Pop Up)
                    </Select.Option>
                    <Select.Option value="SINGLE_DOWNLOAD_ABOVE">
                      Single Download (Above)
                    </Select.Option>
                    <Select.Option value="SINGLE_DOWNLOAD_INLINE">
                      Single Download (Inline)
                    </Select.Option>
                    <Select.Option value="SINGLE_DOWNLOAD_BELOW">
                      Single Download (Below)
                    </Select.Option>
                    <Select.Option value="SINGLE_DOWNLOAD_POP_UP">
                      Single Download (Pop Up)
                    </Select.Option>
                    <Select.Option value="DOWNLOADING_PAGE">
                      Download (Downloading Page)
                    </Select.Option>
                  </Select>
                  {errors?.position && (
                    <FormErrorMessage>
                      {errors.position.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.active)}>
                  <FormLabel>Active</FormLabel>
                  <Checkbox {...register("active")} />
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
