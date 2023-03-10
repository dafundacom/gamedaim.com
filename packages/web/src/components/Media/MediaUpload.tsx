import * as React from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Button, DropZone, FormControl, FormErrorMessage } from "ui"

import { fetch } from "@/lib/fetch"
import { resizeImage } from "@/utils/resize-image"

interface FormValues {
  file: Blob
}

interface MediaUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  addLoadMedias: any
}

export const MediaUpload = React.forwardRef<HTMLDivElement, MediaUploadProps>(
  (props) => {
    const { addLoadMedias, ...rest } = props
    const [showUploadForm, setShowUploadForm] = React.useState<boolean>(false)
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
        const image = await resizeImage(values.file[0])
        const { data } = await fetch.post(
          "/media/image",
          { image },
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        addLoadMedias()
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
      <div className="my-2 space-y-2" {...rest}>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          Add New
        </Button>
        <div className={showUploadForm ? "flex" : "hidden"}>
          <div className="flex-1 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormControl invalid={Boolean(errors.file)}>
                <DropZone {...register("file")} />
                {errors?.file && (
                  <FormErrorMessage>{errors.file.message}</FormErrorMessage>
                )}
              </FormControl>
              <div className="align-center flex justify-center">
                <Button variant="solid" loading={loading}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  },
)
