import * as React from "react"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import NextImage from "next/image"
import toast from "react-hot-toast"
import { MdOutlineClose } from "react-icons/md"
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
import { DownloadDataProps } from "@/lib/data-types"
import { ModalSelectMedia } from "@/components/Modal"
import { getSettingsSite } from "@/lib/settings"
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

export default function CreateDownloadfilesDashboard(props: {
  settingsSite: any
}) {
  const { settingsSite } = props
  const router = useRouter()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [downloads, setDownloads] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [searchResults, setSearchResults] = React.useState([])
  const [selectedDownloads, setSelectedDownloads] = React.useState<any>([])
  const [inputValue, setInputValue] = React.useState("")
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const handleSearchChange = async (e: any) => {
    e.preventDefault()
    setInputValue(e.target.value)
    if (e.target.value.length > 1) {
      const { data } = await fetch.get(`/download/search/${e.target.value}`)

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
      const { data } = await fetch.post("/download-file", mergedValues)
      setSelectedFeaturedImageUrl("")
      setSelectedFeaturedImageId("")
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

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenModal(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Download File | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Add New Download File | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Add New Download File | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Add New Download File | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 mb-[100px] flex items-end justify-end">
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
                  <div className="max-w-xl rounded-md border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                    <div className="parent-focus flex flex-row flex-wrap items-center justify-start gap-2 p-2">
                      {selectedDownloads.length > 0 &&
                        selectedDownloads.map((download: DownloadDataProps) => {
                          return (
                            <>
                              <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 text-[14px] text-black dark:bg-gray-800 dark:text-white">
                                <span>{download.title}</span>
                                <Button
                                  as="div"
                                  onClick={() => handleRemoveValue(download)}
                                  className="!!h-auto !min-w-0 !bg-transparent !p-0 !text-inherit"
                                >
                                  <MdOutlineClose />
                                </Button>
                              </div>
                            </>
                          )
                        })}
                      <Input
                        type="text"
                        className="!h-auto !w-full !min-w-[50px] !max-w-full !shrink !grow !basis-0 !border-none !bg-transparent !p-0 focus:!border-none focus:!ring-0"
                        id="searchDownload"
                        value={inputValue}
                        onChange={handleSearchChange}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <ul className="border-t border-gray-300">
                        {searchResults.map(
                          (searchDownload: DownloadDataProps) => {
                            const dataDownloads = {
                              id: searchDownload.id,
                              title: searchDownload.title,
                            }
                            return (
                              <li
                                key={searchDownload.id}
                                className="px-2 hover:bg-blue-500"
                                onClick={() =>
                                  handleSelectandAssign(dataDownloads)
                                }
                              >
                                {searchDownload.title}
                              </li>
                            )
                          },
                        )}
                      </ul>
                    )}
                  </div>
                </div>
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
              <ModalSelectMedia
                handleSelectUpdateMedia={handleUpdateMedia}
                open={openModal}
                setOpen={setOpenModal}
              />
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
