import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
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
  slug: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}

export default function EditArticleDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")
  const [topics, setTopics] = React.useState<any>([])
  const [loadedTopics, setLoadedTopics] = React.useState([])
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [article, setArticle] = React.useState<any>({
    id: "",
    title: "",
    excertp: "",
    slug: "",
  })
  const editor = useEditor({
    extensions: [EditorKitExtension],
    content: editorContent,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML())
    },
  })

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

  const router = useRouter()

  React.useEffect(() => {
    loadArticle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  React.useEffect(() => {
    reset(article)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article])

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

  const loadArticle = async () => {
    try {
      const { data } = await axios.get(`/article/${router.query.id}`)
      setArticle({
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
      })
      setSelectedFeaturedImageId(data.featuredImage.id)
      setSelectedFeaturedImageUrl(data.featuredImage.url)
      setEditorContent(data.content)
      setTopics(data.topics.map((topic: any) => topic.id))
      editor?.commands.setContent(data.content)
    } catch (err) {
      console.log(err)
    }
  }

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>({ mode: "onBlur" })

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const mergedValues = {
        ...values,
        topicIds: topics,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await axios.put(`/article/${article.id}`, mergedValues)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Article updated successfully")
        setLoading(false)
        router.push(`/dashboard/articles`)
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
      setLoading(false)
    }
  }

  return (
    <>
      <NextSeo
        title={`Edit Article | ${env.SITE_TITLE}`}
        description={`Edit Article | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Edit Article | ${env.SITE_TITLE}`,
          description: `Edit Article | ${env.SITE_TITLE}`,
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
              <div className="px-3">
                <div className="flex min-w-[300px] flex-col space-y-4">
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
                        <FormErrorMessage>
                          {errors.slug.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </div>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <Heading as="h3" size="md">
                    Topics
                  </Heading>
                  {loadTopics.isFetching === false &&
                    loadedTopics.map((topic: { title: string; id: string }) => (
                      <>
                        {topics.find((t: string) => t == topic.id) ? (
                          <Checkbox
                            key={topic.title}
                            value={topic.id}
                            onChange={() => assignTopic(topic.id as string)}
                            checked={true}
                          >
                            {topic.title}
                          </Checkbox>
                        ) : (
                          <Checkbox
                            key={topic.title}
                            value={topic.id}
                            onChange={() => assignTopic(topic.id as string)}
                          >
                            {topic.title}
                          </Checkbox>
                        )}
                      </>
                    ))}
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
          className="!max-w-full"
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
      </AdminRole>
    </>
  )
}
