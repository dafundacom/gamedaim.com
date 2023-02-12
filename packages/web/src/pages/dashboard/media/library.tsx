// TODO: not yet styled
import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { MdAdd, MdDeleteOutline } from "react-icons/md"
import { Button, IconButton } from "ui"

import { ContentContext } from "@/contexts/content.context"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function MediaLibraryDashboard() {
  const [post, setPost] = React.useContext(ContentContext)

  const { medias } = post

  const getMedias = async () => {
    try {
      const { data } = await axios.get("/media/page/1")
      setPost((prev: any) => ({ ...prev, medias: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getMedias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (media: { id: string }) => {
    try {
      const { data } = await axios.delete(`/media/${media.id}`)
      if (data.ok) {
        setPost({
          ...medias,
          media: medias.filter((media: { id: string }) => media.id !== data.id),
          selected: null,
        })
        toast.success("Image deleted successfully")
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/media/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="grid grid-cols-5 gap-3 my-3">
          {medias.map(
            (media: { id: string; name: string; url: string; alt: string }) => (
              <>
                <div>
                  <IconButton
                    colorScheme="red"
                    className="!rounded-full !p-0"
                    onClick={() => handleDelete(media)}
                  >
                    <MdDeleteOutline />
                  </IconButton>
                  <NextLink href={`/dashboard/media/${media.id}`}>
                    <NextImage
                      key={media.id}
                      src={media.url}
                      alt={media.alt}
                      fill
                      className="max-w-[500px] max-h-[500px] object-cover !relative rounded-sm border-2 border-gray-300"
                    />
                  </NextLink>
                </div>
              </>
            ),
          )}
        </div>
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
