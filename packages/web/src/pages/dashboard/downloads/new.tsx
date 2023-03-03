import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdChevronLeft, MdOutlineViewSidebar } from "react-icons/md"
import { useEditor, EditorContent } from "@tiptap/react"
import { EditorKitExtension, EditorMenu } from "editor"
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
  useDisclosure,
} from "ui"

import env from "@/env"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import { DownloadFileDataProps, DownloadSchemaTypeData } from "@/lib/data-types"
import { fetcher } from "@/lib/fetcher"
import { AddDownloadFile, AddTopics } from "@/components/Form"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table"
import { ActionDashboard } from "@/components/Action"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"
// import { AddDownloadFile } from "@/components/Form"

interface FormValues {
  title: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
  developer: string
  operationSystem: string
  license: string
  officialWeb: string
  schemaType: DownloadSchemaTypeData
  type: string
}

export default function CreateDownloadsDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")
  const [topics, setTopics] = React.useState([])
  const [selectedTopics, setSelectedTopics] = React.useState<any>([])

  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [selectedDownloadFile, setSelectedDownloadFile] = React.useState<any>(
    [],
  )
  const [selectedDownloadFileId, setSelectedDownloadFileId] =
    React.useState<any>([])
  const [showAddFiles, setShowAddFiles] = React.useState(false)
  const router = useRouter()

  const { isOpen, onToggle } = useDisclosure()

  const { data: medias } = useSWR(`/media/page/1`, fetcher, {
    onSuccess: (data: any) => {
      setLoadedMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const editor = useEditor({
    extensions: [EditorKitExtension],
    content: "<p></p>",
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML())
    },
  })

  const handleUpdateFile = (value: any) => {
    setSelectedDownloadFile((prev: any) => [...prev, value])
    setSelectedDownloadFileId((prev: any) => [...prev, value.id])
    setShowAddFiles(false)
  }

  const handleDeleteFile = (value: DownloadFileDataProps) => {
    const filteredResult = selectedDownloadFile.filter(
      (item: any) => item.id !== value.id,
    )

    const filteredData = selectedDownloadFileId.filter(
      (item: any) => item !== value.id,
    )
    setSelectedDownloadFile(filteredResult)
    setSelectedDownloadFileId(filteredData)
  }

  const onSubmit = async (values: any) => {
    setLoading(true)
    if (selectedDownloadFile.length > 0) {
      try {
        const mergedValues = {
          ...values,
          content: editorContent,
          topicIds: topics,
          downloadFileIds: selectedDownloadFileId,
          featuredImageId: selectedFeaturedImageId,
        }
        const { data } = await axios.post("/download", mergedValues)
        console.log(mergedValues)

        if (data?.error) {
          toast.error(data.error)
        } else {
          setSelectedDownloadFile([])
          setSelectedDownloadFileId([])
          setSelectedFeaturedImageId("")
          setSelectedFeaturedImageUrl("")
          setSelectedTopics([])
          reset()
          toast.success("Download Successfully created")
        }
      } catch (err: any) {
        console.log("err => ", err)
        toast.error(err.response.data.message)
      }
    } else {
      toast.error("File is empty")
    }

    setLoading(false)
    editor?.commands.clearContent()
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({ mode: "onBlur" })

  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)

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
        title={`Add New Download | ${env.SITE_TITLE}`}
        description={`Add New Download | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Add New Download | ${env.SITE_TITLE}`,
          description: `Add New Download | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="space-y-4"
        >
          <div className="sticky top-[0px] z-[9999] flex items-center justify-between bg-white py-5 px-3">
            <Button variant="ghost" leftIcon={<MdChevronLeft />}>
              <NextLink href="/dashboard/downloads">Downloads</NextLink>
            </Button>
            <div>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                variant="ghost"
                loading={loading}
              >
                Publish
              </Button>
              <IconButton variant="ghost" onClick={onToggle}>
                <MdOutlineViewSidebar />
              </IconButton>
            </div>
          </div>
          <ArticleDashboardLayout
            isOpen={isOpen}
            sidebar={
              <div className="scollbarhide scrollbar fixed right-0 top-[65px] bottom-[95px] flex min-w-[300px] max-w-[300px] flex-col space-y-4 overflow-x-auto border bg-white px-4 py-4 dark:bg-inherit">
                <AddTopics
                  topics={topics}
                  addTopics={setTopics}
                  selectedTopics={selectedTopics}
                  addSelectedTopics={setSelectedTopics}
                />
                {selectedFeaturedImageId ? (
                  <div className="my-2 flex flex-col px-4">
                    <Heading as="h3" size="md">
                      Featured Image
                    </Heading>
                    <NextImage
                      src={selectedFeaturedImageUrl}
                      fill
                      alt="Featured Image"
                      className="!relative mt-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                      onClick={() => setOpenModal(true)}
                    />
                  </div>
                ) : (
                  <div className="my-2 flex flex-col px-4">
                    <Heading as="h3" size="md">
                      Featured Image
                    </Heading>
                    <Text
                      size="sm"
                      colorScheme="blue"
                      className="border-1 cursor-pointer rounded-md border-gray-200 p-8 text-center"
                      onClick={() => setOpenModal(true)}
                    >
                      Select Featured Image
                    </Text>
                  </div>
                )}
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Excerpt
                  </Heading>
                  <FormControl invalid={Boolean(errors.excerpt)}>
                    <Textarea
                      {...register("excerpt")}
                      placeholder="Enter Meta Title (Optional)"
                    />
                    {errors?.excerpt && (
                      <FormErrorMessage>
                        {errors.excerpt.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Meta Title
                  </Heading>
                  <FormControl invalid={Boolean(errors.meta_title)}>
                    <Input
                      {...register("meta_title")}
                      placeholder="Enter Meta Title (Optional)"
                    />
                    {errors?.meta_title && (
                      <FormErrorMessage>
                        {errors.meta_title.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Meta Description
                  </Heading>
                  <FormControl invalid={Boolean(errors.meta_description)}>
                    <Textarea
                      {...register("meta_description")}
                      placeholder="Enter Meta Description (Optional)"
                    />
                    {errors?.meta_description && (
                      <FormErrorMessage>
                        {errors.meta_description.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Developer
                  </Heading>
                  <FormControl invalid={Boolean(errors.developer)}>
                    <Input
                      {...register("developer")}
                      placeholder="Enter Developer"
                    />
                    {errors?.developer && (
                      <FormErrorMessage>
                        {errors.developer.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Operation System
                  </Heading>
                  <FormControl invalid={Boolean(errors.operationSystem)}>
                    <Input
                      {...register("operationSystem")}
                      placeholder="Enter Operation System"
                    />
                    {errors?.operationSystem && (
                      <FormErrorMessage>
                        {errors.operationSystem.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    License
                  </Heading>
                  <FormControl invalid={Boolean(errors.license)}>
                    <Input
                      {...register("license")}
                      placeholder="Enter License"
                    />
                    {errors?.license && (
                      <FormErrorMessage>
                        {errors.license.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Official Web
                  </Heading>
                  <FormControl invalid={Boolean(errors.officialWeb)}>
                    <Input
                      {...register("officialWeb")}
                      placeholder="Enter License"
                    />
                    {errors?.officialWeb && (
                      <FormErrorMessage>
                        {errors.officialWeb.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>

                <div className="my-2 !mb-[20px] flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Schema Type
                  </Heading>
                  <FormControl invalid={Boolean(errors.schemaType)}>
                    <Select
                      id="schemaType"
                      className="max-w-sm"
                      {...register("schemaType")}
                    >
                      <Select.Option value="DownloadApp">
                        Download
                      </Select.Option>
                      <Select.Option value="BusinessApp">
                        Business
                      </Select.Option>
                      <Select.Option value="MultimediaApp">
                        Multimedia
                      </Select.Option>
                      <Select.Option value="MobileApp">Mobile</Select.Option>
                      <Select.Option value="WebApp">Web</Select.Option>
                      <Select.Option value="SocialNetworkingApp">
                        Social
                      </Select.Option>
                      <Select.Option value="TravelApp">Travel</Select.Option>
                      <Select.Option value="ShoppingApp">
                        Shopping
                      </Select.Option>
                      <Select.Option value="SportsApp">Sports</Select.Option>
                      <Select.Option value="LifeStyleApp">
                        Lifestyle
                      </Select.Option>
                      <Select.Option value="DesignApp">Design</Select.Option>
                      <Select.Option value="DeveloperApp">
                        Developer
                      </Select.Option>
                      <Select.Option value="DriverApp">Driver</Select.Option>
                      <Select.Option value="EducationalApp">
                        Education
                      </Select.Option>
                      <Select.Option value="HealthApp">Health</Select.Option>
                      <Select.Option value="FinanceApp">Finance</Select.Option>
                      <Select.Option value="SecurityApp">
                        Security
                      </Select.Option>
                      <Select.Option value="BrowserApp">Browser</Select.Option>
                      <Select.Option value="CommunicationApp">
                        Communication
                      </Select.Option>
                      <Select.Option value="HomeApp">Home</Select.Option>
                      <Select.Option value="UtilitiesApp">
                        Utilities
                      </Select.Option>
                      <Select.Option value="RefereceApp">
                        Referece
                      </Select.Option>
                      <Select.Option value="GameApp">Game</Select.Option>
                    </Select>
                    {errors?.schemaType && (
                      <FormErrorMessage>
                        {errors.schemaType.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Type
                  </Heading>
                  <FormControl invalid={Boolean(errors.type)}>
                    <Select
                      id="type"
                      className="max-w-sm"
                      {...register("type")}
                    >
                      <Select.Option value="App">Application</Select.Option>
                      <Select.Option value="Game">Game</Select.Option>
                    </Select>
                    {errors?.type && (
                      <FormErrorMessage>{errors.type.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </div>
            }
          >
            <div className="relative mt-4 flex items-center justify-center">
              <div className="flex-1 space-y-4">
                <FormControl invalid={Boolean(errors.title)}>
                  <Input
                    type="text"
                    size="4xl"
                    variant="plain"
                    className="font-bold"
                    {...register("title", {
                      required: "Title is Required",
                    })}
                    placeholder="Title"
                  />
                  {errors?.title && (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.content)}>
                  <EditorMenu editor={editor} />
                  <EditorContent editor={editor} />
                  <Text size="xs" className="absolute right-0 bottom-0">
                    {editor?.storage.characterCount.words()} words
                  </Text>
                </FormControl>
              </div>
            </div>
          </ArticleDashboardLayout>
        </form>
        <div className="border-t p-4">
          <div className="flex justify-between pb-2">
            <Heading>Files</Heading>
            <Button onClick={() => setShowAddFiles(true)}>Add File</Button>
          </div>
          <div>
            {selectedDownloadFile.length > 0 && (
              <Table>
                <Thead>
                  <Tr isTitle>
                    <Th>Title</Th>
                    <Th>Version</Th>
                    <Th>Size</Th>
                    <Th>Price</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedDownloadFile.map(
                    (downloadFile: DownloadFileDataProps) => (
                      <Tr key={downloadFile.id}>
                        <Td className="whitespace-nowrap">
                          <div className="flex">
                            <span className="font-medium">
                              {downloadFile.title}
                            </span>
                          </div>
                        </Td>
                        <Td className="whitespace-nowrap">
                          <div className="flex">
                            <span className="font-medium">
                              {downloadFile.version}
                            </span>
                          </div>
                        </Td>
                        <Td>{downloadFile.fileSize}</Td>
                        <Td>{downloadFile.price}</Td>
                        <Td align="right">
                          <ActionDashboard
                            onDelete={() => handleDeleteFile(downloadFile)}
                            editLink={`/dashboard/download-files/${downloadFile.id}`}
                            content={downloadFile.title}
                          />
                        </Td>
                      </Tr>
                    ),
                  )}
                </Tbody>
              </Table>
            )}
          </div>
          {showAddFiles && (
            <div>
              <AddDownloadFile updateDownloadFiles={handleUpdateFile} />
            </div>
          )}
        </div>
        <Modal
          title="Select Featured Image"
          content={
            <>
              <MediaUpload addLoadMedias={setLoadedMedias} />
              <div className="my-3">
                {medias && (
                  <InfiniteScrollMedia
                    medias={loadedMedias}
                    index={2}
                    updateMedia={handleUpdateMedia}
                    totalPage={totalPageMedias}
                  />
                )}
              </div>
            </>
          }
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      </AdminRole>
    </>
  )
}
