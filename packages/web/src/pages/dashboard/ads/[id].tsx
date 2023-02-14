import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
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

export default function EditAdDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [ad, setAd] = React.useState<any>({
    id: "",
    title: "",
    content: "",
    position: "",
  })

  const router = useRouter()

  React.useEffect(() => {
    reset(ad)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad])

  const loadAd = useQuery({
    queryKey: ["ads"],
    queryFn: () => async () => {
      const { data } = await axios.get(`/ad/${router.query.id}`)
      return data
    },
    keepPreviousData: true,
    onSuccess: (data: any) => {
      setAd({
        id: data.id,
        title: data.title,
        content: data.content,
        position: data.position,
      })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const { data } = await axios.put(`/ad/${ad.id}`, values)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Ad updated successfully")
        setLoading(false)
        router.push(`/dashboard/ads`)
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
            {loadAd.isSuccess && (
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
                    <FormErrorMessage>
                      {errors.position.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AdminRole>
  )
}
