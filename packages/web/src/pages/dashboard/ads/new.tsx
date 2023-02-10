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
  content?: string
  position?: "ABOVE_POST" | "INLINE_POST" | "BELOW_POST" | "POP_UP"
}

export default function CreateAdsDashBoard() {
  const [loading, setLoading] = React.useState<boolean>(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    console.log(values)
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
                  <FormErrorMessage>{errors.content.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl invalid={Boolean(errors.position)}>
                <FormLabel>
                  Position
                  <RequiredIndicator />
                </FormLabel>
                <select {...register("position")}>
                  <option value="ABOVE_POST">Above Post</option>
                  <option value="BELOW_POST">Below Post</option>
                  <option value="INLINE_POST">Inline Post</option>
                  <option value="POP_UP">Pop Up</option>
                </select>
                {errors?.position && (
                  <FormErrorMessage>{errors.position.message}</FormErrorMessage>
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