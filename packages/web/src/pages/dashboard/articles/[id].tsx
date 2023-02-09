import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
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
  useDisclosure,
} from "ui"

import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"
import { Modal } from "@/components/Modal"

interface FormValues {
  title: string
  slug: string
  content: string
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

  const loadTopics = async () => {
    try {
      const { data } = await axios.get("/topic/all/1")
      setLoadedTopics(data)
    } catch (err) {
      console.log(err)
    }
  }

  const loadMedias = async () => {
    try {
      const { data } = await axios.get("/media/all/1")
      setLoadedMedias(data)
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const router = useRouter()

  React.useEffect(() => {
    loadArticle()
    loadTopics()
    loadMedias()
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
              <div className="flex flex-col min-w-[300px] space-y-4">
                <div className="flex flex-col px-4 my-2">
                  <Heading as="h3">Slug</Heading>
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
              </div>
              <div className="flex flex-col px-4 my-2">
                <Heading as="h3">Topics</Heading>
                {loadedTopics.map((topic: { title: string; id: string }) => (
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
                <div className="flex flex-col px-4 my-2">
                  <Heading as="h3">Featured Image</Heading>
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
                  <Heading as="h3">Featured Image</Heading>
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
        className="!max-w-full"
        content={
          <>
            <div className="grid grid-cols-5 gap-3 my-3">
              {loadedMedias.map(
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
  )
}
