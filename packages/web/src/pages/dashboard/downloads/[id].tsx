import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
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

import { ModalSelectMedia } from "@/components/Modal"
import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import {
  DownloadFileDataProps,
  DownloadSchemaTypeData,
  TopicDataProps,
} from "@/lib/data-types"
import { AddDownloadFile, AddTopics } from "@/components/Form"
import { Table, Thead, Tr, Th, Tbody, Td } from "@/components/Table"
import { ActionDashboard } from "@/components/Action"
import { getSettingsSite } from "@/lib/settings"

interface FormValues {
  title: string
  slug: string
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

export default function EditDownloadDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")
  const [topics, setTopics] = React.useState<any>([])
  const [selectedTopics, setSelectedTopics] = React.useState([])
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
  const [download, setDownload] = React.useState<any>({
    title: "",
    content: "",
    slug: "",
    excerpt: "",
    meta_title: "",
    meta_description: "",
    developer: "",
    operationSystem: "",
    license: "",
    officialWeb: "",
    schemaType: "",
    type: "",
  })
  const editor = useEditor({
    extensions: [EditorKitExtension],
    content: editorContent,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML())
    },
  })

  const { isOpen, onToggle } = useDisclosure()

  const router = useRouter()

  React.useEffect(() => {
    loadDownload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  React.useEffect(() => {
    reset(download)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download])

  const loadDownload = async () => {
    try {
      const { data } = await axios.get(`/download/${router.query.id}`)
      setDownload({
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        developer: data.developer,
        operationSystem: data.operationSystem,
        license: data.license,
        officialWeb: data.officialWeb,
        schemaType: data.schemaType,
        type: data.type,
      })
      setSelectedDownloadFile(data.downloadFiles)
      setSelectedDownloadFileId(
        data.downloadFiles.map((file: { id: any }) => file.id),
      )
      setSelectedFeaturedImageId(data.featuredImage.id)
      setSelectedFeaturedImageUrl(data.featuredImage.url)
      setEditorContent(data.content)
      setTopics(data.topics.map((topic: TopicDataProps) => topic.id))
      setSelectedTopics(data.topics)
      console.log(data)

      editor?.commands.setContent(data.content)
    } catch (err) {
      console.log(err)
    }
  }

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
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>({ mode: "onBlur" })

  const onSubmit = async (values: any) => {
    if (selectedDownloadFile.length > 0) {
      try {
        setLoading(true)
        const mergedValues = {
          ...values,
          topicIds: topics,
          content: editorContent,
          featuredImageId: selectedFeaturedImageId,
          downloadFileIds: selectedDownloadFileId,
        }
        const { data } = await axios.put(
          `/download/${download.id}`,
          mergedValues,
        )

        if (data?.error) {
          toast.error(data?.error)
          setLoading(false)
        } else {
          toast.success("Download updated successfully")
          setLoading(false)
          router.push(`/dashboard/downloads`)
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
        setLoading(false)
        editor?.commands.clearContent()
      }
    } else {
      toast.error("File is empty")
    }
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
        title={`Edit Download | ${settingsSite.title?.value || ""}`}
        description={`Edit Download | ${settingsSite.title?.value || ""}`}
        canonical={`https://${settingsSite.url?.value || ""}${router.pathname}`}
        openGraph={{
          url: `https://${settingsSite.url?.value || ""}${router.pathname}`,
          title: `Edit Download | ${settingsSite.title?.value || ""}`,
          description: `Edit Download | ${settingsSite.title?.value || ""}`,
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
          <div className="sticky top-[0px] z-[90] flex items-center justify-between bg-white py-5 px-3 dark:bg-gray-800">
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
                Save
              </Button>
              <IconButton variant="ghost" onClick={onToggle}>
                <MdOutlineViewSidebar />
              </IconButton>
            </div>
          </div>
          <ArticleDashboardLayout
            isOpen={isOpen}
            sidebar={
              <div className="scollbarhide scrollbar fixed right-0 top-[65px] bottom-[95px] flex min-w-[300px] max-w-[300px] flex-col space-y-4 overflow-x-auto border bg-white px-4 py-4 dark:bg-inherit max-sm:!min-w-full max-sm:!max-w-full">
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Slug
                  </Heading>
                  <FormControl invalid={Boolean(errors.slug)}>
                    <Input
                      type="text"
                      size="sm"
                      {...register("slug", {
                        required: "Slug is Required",
                      })}
                      placeholder="Slug"
                    />
                    {errors?.slug && (
                      <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
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
                      placeholder="Enter Excerpt (Optional)"
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
                    <Th>Actions</Th>
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
        <ModalSelectMedia
          handleSelectUpdateMedia={handleUpdateMedia}
          open={openModal}
          setOpen={setOpenModal}
        />
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
