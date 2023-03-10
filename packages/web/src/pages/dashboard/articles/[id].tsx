import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
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
  Text,
  Textarea,
  useDisclosure,
} from "ui"

import env from "@/env"
import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import { TopicDataProps } from "@/lib/data-types"
import { AddTopics } from "@/components/Form"
import { ModalSelectMedia } from "@/components/Modal"
import { getSettingsSite } from "@/lib/settings"
import { fetch } from "@/lib/fetch"

interface FormValues {
  title: string
  slug: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}

export default function EditArticleDashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")
  const [topics, setTopics] = React.useState<any>([])
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [article, setArticle] = React.useState<any>({
    id: "",
    title: "",
    excerpt: "",
    slug: "",
    meta_title: "",
    meta_description: "",
  })
  const [selectedTopics, setSelectedTopics] = React.useState<any>([])

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
    loadArticle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  React.useEffect(() => {
    reset(article)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article])

  const loadArticle = async () => {
    try {
      const { data } = await fetch.get(`/article/${router.query.id}`)
      setArticle({
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
      })
      setSelectedTopics(data.topics)
      setSelectedFeaturedImageId(data.featuredImage.id)
      setSelectedFeaturedImageUrl(data.featuredImage.url)
      setEditorContent(data.content)
      setTopics(data.topics.map((topic: TopicDataProps) => topic.id))
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
        content: editorContent,
        topicIds: topics,
        featuredImageId: selectedFeaturedImageId,
      }
      const { data } = await fetch.put(`/article/${article.id}`, mergedValues)

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
      editor?.commands.clearContent()
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
        title={`Edit Article | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={`Edit Article | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Edit Article | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Edit Article | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
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
              <div className="">
                <div className="scollbarhide scrollbar fixed top-0 bottom-0 right-0 mt-[70px] flex min-w-[300px] max-w-[300px] flex-col space-y-4 overflow-auto bg-white p-4 dark:bg-[inherit] max-sm:!min-w-full max-sm:!max-w-full">
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
