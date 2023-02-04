import * as React from "react"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { MdChevronLeft, MdOutlineViewSidebar } from "react-icons/md"
import { useEditor, EditorContent } from "@tiptap/react"
import { EditorKitExtension, EditorMenu } from "editor"
import {
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "ui"

import { AdminRole } from "@/components/Role"
import { ArticleDashboardLayout } from "@/layouts/ArticleDashboard"

interface FormValues {
  title: string
  content: string
}

export default function CreateArticlesDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [editorContent, setEditorContent] = React.useState("")

  const { isOpen, onToggle } = useDisclosure()

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
      const mergedValues = { ...values, content: editorContent }
      console.log(mergedValues)
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
            <>
              <div>div</div>
              <div>div</div>
            </>
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
