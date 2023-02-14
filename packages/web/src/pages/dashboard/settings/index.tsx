import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
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
  meta_title?: string
  meta_description?: string
}

export default function SettingDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [setting, setSetting] = React.useState<any>({
    url: "",
    title: "",
    description: "",
    meta_title: "",
    meta_description: "",
  })

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>()

  React.useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const { data } = await axios.put(`/setting/${setting.key}`, values)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Setting updated successfully")
        setLoading(false)
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
          </div>
        </div>
      </DashboardLayout>
    </AdminRole>
  )
}
