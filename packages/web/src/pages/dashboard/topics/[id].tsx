import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
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

import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

interface FormValues {
  title: string
  slug: string
  description?: string
}

export default function EditTopicDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [topic, setTopic] = React.useState<any>({
    id: "",
    title: "",
    slug: "",
    description: "",
  })

  const router = useRouter()

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
        slug: data.slug,
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
      const { data } = await axios.put(`/topic/${topic.id}`, values)
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

  return (
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
                <Textarea {...register("description")} className="max-w-xl" />
                {errors?.description && (
                  <FormErrorMessage>
                    {errors.description.message}
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
  )
}
