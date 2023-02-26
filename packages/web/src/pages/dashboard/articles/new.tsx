import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { MdChevronLeft, MdOutlineViewSidebar } from "react-icons/md"
import { useEditor, EditorContent } from "@tiptap/react"
import { EditorKitExtension, EditorMenu } from "editor"
import { MdOutlineClose } from "react-icons/md"
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  useDisclosure,
} from "ui"

import env from "@/env"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import { MediaDataProps, TopicDataProps } from "@/lib/data-types"

interface FormValues {
  title: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}

export default function CreateArticlesDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")
  const [topics, setTopics] = React.useState([])
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [searchResults, setSearchResults] = React.useState([])
  const [selectedTopics, setSelectedTopics] = React.useState<any>([])
  const [inputValue, setInputValue] = React.useState("")
  const router = useRouter()

  const { isOpen, onToggle } = useDisclosure()

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

  const editor = useEditor({
    extensions: [EditorKitExtension],
    content: "<p></p>",
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML())
    },
  })
  const handleSearchChange = async (e: any) => {
    e.preventDefault()
    setInputValue(e.target.value)
    if (e.target.value.length > 1) {
      const { data } = await axios.get(`/topic/search/${e.target.value}`)

      setSearchResults(data)
    } else if (e.target.value.length < 1) {
      setSearchResults([])
    }
  }

  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedTopics.includes(value.title)) {
      setInputValue("")
      setSearchResults([])
      assignTopic(value.id)
      setSelectedTopics((prev: any) => [...prev, value])
    } else {
      toast.error(value.title + " telah dikirimkan")
      setInputValue("")
      setSearchResults([])
    }
  }

  const handleRemoveValue = (value: any) => {
    const filteredResult = selectedTopics.filter(
      (item: any) => item.id !== value.id,
    )

    const filteredData = topics.filter((item: any) => item !== value.id)
    setSelectedTopics(filteredResult)
    setTopics(filteredData)
  }
  const assignTopic = (id: string | never) => {
    const checkedTopics = [...topics]
    const index = checkedTopics.indexOf(id as never)
    if (index === -1) {
      checkedTopics.push(id as never)
    } else {
      checkedTopics.splice(index, 1)
    }
    setTopics(checkedTopics)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({ mode: "onBlur" })

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        content: editorContent,
        topicIds: topics,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await axios.post("/article", mergedValues)
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Article Successfully created")
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
    editor?.commands.clearContent()
    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Article | ${env.SITE_TITLE}`}
        description={`Add New Article | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Add New Article | ${env.SITE_TITLE}`,
          description: `Add New Article | ${env.SITE_TITLE}`,
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
          <div className="my-5 mx-3 flex items-center justify-between">
            <Button variant="ghost" leftIcon={<MdChevronLeft />}>
              <NextLink href="/dashboard/articles">Articles</NextLink>
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
              <div className="flex min-w-[300px] flex-col space-y-4">
                <div className="px-4">
                  <Heading as="h3" size="md">
                    Topics
                  </Heading>
                  <div className="rounded-md border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                    <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
                      {selectedTopics.length > 0 &&
                        selectedTopics.map((topic: TopicDataProps) => {
                          return (
                            <>
                              <div className="flex items-center bg-gray-200 px-2 py-1 text-[14px] text-black dark:bg-gray-800 dark:text-white">
                                <span>{topic.title}</span>
                                <Button
                                  as="div"
                                  onClick={() => handleRemoveValue(topic)}
                                  className="!h-auto !min-w-0 !bg-transparent !p-0 !text-inherit"
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
                        id="searchTopic"
                        value={inputValue}
                        placeholder="Enter topics"
                        onChange={handleSearchChange}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <ul className="border-t border-gray-300">
                        {searchResults.map((searchTopic: TopicDataProps) => {
                          const dataTopics = {
                            id: searchTopic.id,
                            title: searchTopic.title,
                          }
                          return (
                            <li
                              key={searchTopic.id}
                              className="px-2 hover:bg-blue-500"
                              onClick={() => handleSelectandAssign(dataTopics)}
                            >
                              {searchTopic.title}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
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
        <Modal
          title="Select Featured Image"
          content={
            <>
              <MediaUpload />
              <div className="my-3 grid grid-cols-5 gap-3">
                {loadMedias.isFetching === false &&
                  loadedMedias.map((media: MediaDataProps) => (
                    <>
                      <NextImage
                        key={media.id}
                        src={media.url}
                        alt={media.id}
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
                  ))}
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
