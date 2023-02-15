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
import {
  Button,
  Checkbox,
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
  const [loadedTopics, setLoadedTopics] = React.useState([])
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")

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

  const loadTopics = useQuery({
    queryKey: ["loadedTopics"],
    queryFn: async () => {
      const { data } = await axios.get("/topic/page/1")
      return data
    },
    onSuccess: (data: any) => {
      setLoadedTopics(data)
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
    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Article | ${env.SITE_TITLE}`}
        description={`Add New Article | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
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
          <div className="my-5 mx-3 flex justify-between items-center">
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
              <div className="flex flex-col min-w-[300px] space-y-4">
                <div className="flex flex-col px-4 my-2">
                  <Heading as="h3" size="md">
                    Topics
                  </Heading>
                  {loadTopics.isFetching === false &&
                    loadedTopics.map((topic: { title: string; id: string }) => (
                      <Checkbox
                        key={topic.title}
                        value={topic.id}
                        onClick={() => assignTopic(topic.id as string)}
                      >
                        {topic.title}
                      </Checkbox>
                    ))}
                </div>
                {selectedFeaturedImageId ? (
                  <div className="flex flex-col px-4 my-2">
                    <Heading as="h3" size="md">
                      Featured Image
                    </Heading>
                    <NextImage
                      src={selectedFeaturedImageUrl}
                      fill
                      alt="Featured Image"
                      className="max-w-[200px] max-h-[200px] object-cover !relative rounded-sm border-2 border-gray-300 mt-2 cursor-pointer"
                      onClick={() => setOpenModal(true)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col px-4 my-2">
                    <Heading as="h3" size="md">
                      Featured Image
                    </Heading>
                    <Text
                      size="sm"
                      colorScheme="blue"
                      className="text-center p-8 border-1 border-gray-200 rounded-md cursor-pointer"
                      onClick={() => setOpenModal(true)}
                    >
                      Select Featured Image
                    </Text>
                  </div>
                )}
                <div className="flex flex-col px-4 my-2">
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
                <div className="flex flex-col px-4 my-2">
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
                <div className="flex flex-col px-4 my-2">
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
            <div className="mt-4 relative flex items-center justify-center">
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
                  <Text size="xs" className="right-0 bottom-0 absolute">
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
              <div className="grid grid-cols-5 gap-3 my-3">
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
                          alt={media.id}
                          fill
                          className="max-w-[500px] max-h-[500px] object-cover !relative rounded-sm border-2 border-gray-300 cursor-pointer"
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
      </AdminRole>
    </>
  )
}
