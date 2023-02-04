import * as React from "react"
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
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "ui"

import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"

interface FormValues {
  title: string
  slug: string
  content: string
}

export default function EditArticleDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("<p></p>")
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

  const router = useRouter()

  React.useEffect(() => {
    loadArticle()
  }, [editor])

  React.useEffect(() => {
    reset(article)
  }, [article])

  const loadArticle = async () => {
    try {
      const { data } = await axios.get(`/article/${router.query.id}`)
      setArticle({
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
      })
      setEditorContent(data.content)
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
      const { data } = await axios.put(`/article/${article.id}`, values)
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
              <FormLabel>Slug</FormLabel>
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
    </AdminRole>
  )
}
