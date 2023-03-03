import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import useSWR from "swr"
import toast from "react-hot-toast"
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
  Text,
  Textarea,
  useDisclosure,
} from "ui"

import env from "@/env"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import { fetcher } from "@/lib/fetcher"
import { AddTopics } from "@/components/Form"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"

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
  const [selectedTopics, setSelectedTopics] = React.useState<any>([])
  const router = useRouter()
  const { isOpen, onToggle } = useDisclosure()
  const { data: medias } = useSWR(`/media/page/1`, fetcher, {
    onSuccess: (data: any) => {
      setLoadedMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    revalidateIfStale: true,
  })

  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)

  const editor = useEditor({
    extensions: [EditorKitExtension],
    content: "<p></p>",
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML())
    },
  })

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
      setSelectedTopics([])
      setSelectedFeaturedImageUrl("")
      setSelectedFeaturedImageId("")
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
          <div className="sticky top-[1.25rem] my-5 mx-3 flex items-center justify-between">
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
              <div className="scollbarhide scrollbar fixed right-0 top-[65px] bottom-0 flex min-w-[300px] max-w-[300px] flex-col space-y-4 bg-white px-4 dark:bg-[inherit]">
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
