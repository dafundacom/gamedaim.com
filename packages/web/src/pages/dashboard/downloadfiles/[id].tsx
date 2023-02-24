import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
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

import env from "@/env"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

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

export default function EditDownloadFileDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [downloadFile, setDownloadFile] = React.useState<any>({
    id: "",
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    version: "",
    downloadLink: "",
    fileSize: "",
    currency: "",
    price: "",
  })
  const [downloads, setDownloads] = React.useState([])
  const [searchResults, setSearchResults] = React.useState([])
  const [selectedDownloads, setSelectedDownloads] = React.useState<any>([])
  const [inputValue, setInputValue] = React.useState("")
  const router = useRouter()
  console.log(downloads)
  const loadMedias = useQuery({
    queryKey: ["loadedMedias"],
    queryFn: async () => {
      const { data } = await axios.get("/media/page/1")
      return data
    },
    refetchInterval: 10000,
    onSuccess: (data: any) => {
      setLoadedMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  React.useEffect(() => {
    loadDownloadFile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  React.useEffect(() => {
    reset(downloadFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFile])

  const loadDownloadFile = async () => {
    try {
      const { data } = await axios.get(`/download-file/${router.query.id}`)
      setDownloadFile({
        id: data.id,
        title: data.title,
        meta_title: data.meta_title,
        slug: data.slug,
        meta_description: data.meta_description,
        version: data.version,
        downloadLink: data.downloadLink,
        fileSize: data.fileSize,
        currency: data.currency,
        price: data.price,
      })
      setSelectedDownloads(data.downloads)
      setSelectedFeaturedImageId(data.featuredImage.id)
      setSelectedFeaturedImageUrl(data.featuredImage.url)
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

  const handleSearchChange = async (e: any) => {
    e.preventDefault()
    setInputValue(e.target.value)
    if (e.target.value.length > 1) {
      const { data } = await axios.get(`/download/search/${e.target.value}`)

      setSearchResults(data)
    } else if (e.target.value.length < 1) {
      setSearchResults([])
    }
  }
  const assignDownload = (id: string | never) => {
    const checkedDownloads = [...downloads]
    const index = checkedDownloads.indexOf(id as never)
    if (index === -1) {
      checkedDownloads.push(id as never)
    } else {
      checkedDownloads.splice(index, 1)
    }
    setDownloads(checkedDownloads)
  }
  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedDownloads.includes(value.title)) {
      setInputValue("")
      setSearchResults([])
      assignDownload(value.id)
      setSelectedDownloads((prev: any) => [...prev, value])
    } else {
      toast.error(value.title + " telah dikirimkan")
      setInputValue("")
      setSearchResults([])
    }
  }

  const handleRemoveValue = (value: any) => {
    const filteredResult = selectedDownloads.filter(
      (item: any) => item.id !== value.id,
    )

    const filteredData = downloads.filter((item: any) => item !== value.id)
    setSelectedDownloads(filteredResult)
    setDownloads(filteredData)
  }
  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        downloadIds: downloads,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await axios.post("/download-file", mergedValues)

      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Download-file Successfully created")
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
        title={`Add New Download-file | ${env.SITE_TITLE}`}
        description={`Add New Download File | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Add New Download File | ${env.SITE_TITLE}`,
          description: `Add New Download File | ${env.SITE_TITLE}`,
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
                <div>
                  <FormLabel>Downloads:</FormLabel>
                  <div className="max-w-xl border	border-gray-300 p-2">
                    <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                      {selectedDownloads.length > 0 &&
                        selectedDownloads.map((download: any) => {
                          return (
                            <>
                              <div className="bg-gray-200 px-2 py-1 text-[14px] text-black">
                                <span>{download.title}</span>
                                <Button
                                  as="div"
                                  onClick={() => handleRemoveValue(download)}
                                  className="!bg-transparent !p-0 !text-inherit"
                                >
                                  X
                                </Button>
                              </div>
                            </>
                          )
                        })}
                      <Input
                        type="text"
                        className="!w-full !min-w-[50px] !max-w-full !shrink !grow !border-none focus:!border-none focus:!ring-0"
                        id="searchDownload"
                        value={inputValue}
                        onChange={handleSearchChange}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <ul className="border-t border-gray-300">
                        {searchResults.map((searchDownload: any) => {
                          const dataDownloads = {
                            id: searchDownload.id,
                            title: searchDownload.title,
                          }
                          return (
                            <li
                              key={searchDownload.id}
                              className="hover:bg-blue-500"
                              onClick={() =>
                                handleSelectandAssign(dataDownloads)
                              }
                            >
                              {searchDownload.title}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
                <FormControl invalid={Boolean(errors.version)}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    {...register("version")}
                    className="max-w-xl"
                    placeholder="Enter Version"
                  />
                  {errors?.version && (
                    <FormErrorMessage>
                      {errors.version.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
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
                <FormControl invalid={Boolean(errors.downloadLink)}>
                  <FormLabel>Download Link</FormLabel>
                  <Input
                    type="text"
                    {...register("downloadLink")}
                    className="max-w-xl"
                    placeholder="Enter Download Link"
                  />
                  {errors?.downloadLink && (
                    <FormErrorMessage>
                      {errors.downloadLink.message}
                    </FormErrorMessage>
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
                    <FormErrorMessage>
                      {errors.fileSize.message}
                    </FormErrorMessage>
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
                    <FormErrorMessage>
                      {errors.currency.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Submit
                </Button>
              </form>
              <Modal
                title="Select Featured Image"
                content={
                  <>
                    <MediaUpload />
                    <div className="my-3 grid grid-cols-5 gap-3">
                      {loadMedias.isFetching === false &&
                        loadedMedias.map(
                          (media: {
                            id: string
                            name: string
                            url: string
                            alt: string
                          }) => (
                            <>
                              <NextImage
                                key={media.id}
                                src={media.url}
                                alt={media.alt}
                                fill
                                className="!relative max-h-[500px] max-w-[500px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedFeaturedImageId(media.id)
                                  setSelectedFeaturedImageUrl(media.url)
                                  setOpenModal(false)
                                }}
                              />
                            </>
                          ),
                        )}
                    </div>
                  </>
                }
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
