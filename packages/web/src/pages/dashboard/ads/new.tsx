import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useForm } from "react-hook-form"
import {
  Button,
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
  content?: string
  position?: "ABOVE_POST" | "INLINE_POST" | "BELOW_POST" | "POP_UP"
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
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Add New Ad | ${env.SITE_TITLE}`,
          description: `Add New Ad | ${env.SITE_TITLE}`,
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
                    <Select.Option value="ABOVE_POST">Above Post</Select.Option>
                    <Select.Option value="BELOW_POST">Below Post</Select.Option>
                    <Select.Option value="INLINE_POST">
                      Inline Post
                    </Select.Option>
                    <Select.Option value="POP_UP">Pop Up</Select.Option>
                  </Select>
                  {errors?.position && (
                    <FormErrorMessage>
                      {errors.position.message}
                    </FormErrorMessage>
                  )}
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
