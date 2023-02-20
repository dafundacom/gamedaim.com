import * as React from "react"
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
  title: string
  content?: string
  active: boolean
}

export default function EditScriptDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [script, setScript] = React.useState<any>({
    id: "",
    title: "",
    content: "",
    active: "",
  })

  const router = useRouter()

  React.useEffect(() => {
    reset(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script])

  React.useEffect(() => {
    loadScript()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  const loadScript = async () => {
    try {
      const { data } = await axios.get(`/script/${router.query.id}`)
      setScript({
        id: data.id,
        title: data.title,
        content: data.content,
        active: data.active,
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
      const { data } = await axios.put(`/script/${script.id}`, values)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Script updated successfully")
        setLoading(false)
        router.push(`/dashboard/scripts`)
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
        title={`Edit Script | ${env.SITE_TITLE}`}
        description={`Edit Script | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Edit Script | ${env.SITE_TITLE}`,
          description: `Edit Script | ${env.SITE_TITLE}`,
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
                <FormControl invalid={Boolean(errors.content)}>
                  <FormLabel>Content</FormLabel>
                  <Textarea {...register("content")} className="max-w-xl" />
                  {errors?.content && (
                    <FormErrorMessage>
                      {errors.content.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.active)}>
                  <FormLabel>
                    Activate Script
                    <RequiredIndicator />
                  </FormLabel>
                  <input type="checkbox" {...register("active")} />
                  {errors?.active && (
                    <FormErrorMessage>{errors.active.message}</FormErrorMessage>
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
