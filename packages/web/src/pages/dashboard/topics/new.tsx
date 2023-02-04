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
  description?: string
}

export default function CreateTopicsDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const { data } = await axios.post("/topic", values)
      console.log(data)
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
