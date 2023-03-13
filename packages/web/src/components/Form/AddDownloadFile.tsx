import * as React from "react"
import NextImage from "next/image"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Text,
  Textarea,
} from "ui"

import { ModalSelectMedia } from "@/components/Modal"
import { fetch } from "@/lib/fetch"

interface FormValues {
  title: string
  meta_title?: string
  meta_description?: string
  version: string
  downloadLink: string
  fileSize: string
  currency: string
  price: string
}

export const AddDownloadFile = (props: { updateDownloadFiles: any }) => {
  const { updateDownloadFiles } = props
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        downloadIds: [],
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await fetch.post("/download-file", mergedValues)
      updateDownloadFiles(data)
      setSelectedFeaturedImageUrl("")
      setSelectedFeaturedImageId("")
      if (data?.error) {
        toast.error(data.error)
      } else {
        toast.success("Download-file Successfully created")
        reset()
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
    setLoading(false)
  }

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenModal(false)
  }
  return (
    <div className="flex-1 space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
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

          <FormControl invalid={Boolean(errors.version)}>
            <FormLabel>
              Version <RequiredIndicator />
            </FormLabel>
            <Input
              {...register("version", {
                required: "Version is Required",
              })}
              className="max-w-xl"
              placeholder="Enter Version"
            />
            {errors?.version && (
              <FormErrorMessage>{errors.version.message}</FormErrorMessage>
            )}
          </FormControl>
          <div>
            {selectedFeaturedImageId ? (
              <>
                <FormLabel>Featured Image</FormLabel>
                <NextImage
                  src={selectedFeaturedImageUrl}
                  fill
                  alt="Featured Image"
                  className="!relative mt-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                  onClick={() => setOpenModal(true)}
                />
              </>
            ) : (
              <>
                <FormLabel>Featured Image</FormLabel>
                <Text
                  size="sm"
                  colorScheme="blue"
                  className="border-1 max-w-xl cursor-pointer rounded-md border-gray-200 p-8 text-center"
                  onClick={() => setOpenModal(true)}
                >
                  Select Featured Image
                </Text>
              </>
            )}
          </div>

          <FormControl invalid={Boolean(errors.meta_title)}>
            <FormLabel>Meta Title</FormLabel>
            <Input
              type="text"
              {...register("meta_title")}
              className="max-w-xl"
              placeholder="Enter Meta Title (Optional)"
            />
            {errors?.meta_title && (
              <FormErrorMessage>{errors.meta_title.message}</FormErrorMessage>
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
          <FormControl invalid={Boolean(errors.downloadLink)}>
            <FormLabel>
              Download Link <RequiredIndicator />
            </FormLabel>
            <Input
              type="text"
              {...register("downloadLink", {
                required: "Download link is Required",
              })}
              className="max-w-xl"
              placeholder="Enter Download Link"
            />
            {errors?.downloadLink && (
              <FormErrorMessage>{errors.downloadLink.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl invalid={Boolean(errors.price)}>
            <FormLabel>Price</FormLabel>
            <Input
              type="text"
              {...register("price")}
              className="max-w-xl"
              placeholder="Enter Price"
            />
            {errors?.price && (
              <FormErrorMessage>{errors.price.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl invalid={Boolean(errors.fileSize)}>
            <FormLabel>File Size</FormLabel>
            <Input
              type="text"
              {...register("fileSize")}
              className="max-w-xl"
              placeholder="Enter File Size"
            />
            {errors?.fileSize && (
              <FormErrorMessage>{errors.fileSize.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl invalid={Boolean(errors.currency)}>
            <FormLabel>Currency</FormLabel>
            <Input
              type="text"
              {...register("currency")}
              className="max-w-xl"
              placeholder="Enter Currency"
            />
            {errors?.currency && (
              <FormErrorMessage>{errors.currency.message}</FormErrorMessage>
            )}
          </FormControl>
        </div>

        <Button type="submit" variant="solid" loading={loading}>
          Submit
        </Button>
      </form>
      <ModalSelectMedia
        handleSelectUpdateMedia={handleUpdateMedia}
        open={openModal}
        setOpen={setOpenModal}
      />
    </div>
  )
}
