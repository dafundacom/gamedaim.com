// TODO: not yet styled
import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
// import dayjs from "dayjs"
// import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { MdAdd } from "react-icons/md"
import { Button } from "ui"

import { MediaContext } from "@/contexts/media.context"
import { Modal } from "@/components/Modal"
import { AdminOrAuthorRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function MediaLibraryDashboard() {
  const [post, setPost] = React.useContext(MediaContext)
  const [openModal, setOpenModal] = React.useState<boolean>(false)

  const { medias } = post

  // dayjs.extend(relativeTime)

  const getMedias = async () => {
    try {
      const { data } = await axios.get("/media/all/1")
      setPost((prev: any) => ({ ...prev, medias: data }))
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  React.useEffect(() => {
    getMedias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleDelete = async (media: { id: string }) => {
  //   try {
  //     const { data } = await axios.delete(`/media/${media.id}`)
  //     if (data.ok) {
  //       setPost({
  //         ...medias,
  //         media: medias.filter((media: { id: string }) => media.id !== data.id),
  //         selected: null,
  //       })
  //       toast.success("Image deleted successfully")
  //     }
  //   } catch (err: any) {
  //     console.log(err)
  //     toast.error(err.response.data.message)
  //   }
  // }

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="mt-4 flex items-end justify-end">
          <NextLink href="/dashboard/media/new">
            <Button leftIcon={<MdAdd />}>Add New</Button>
          </NextLink>
        </div>
        <div className="grid grid-cols-5 gap-3 my-3">
          {medias.map((media: { id: string; name: string; url: string }) => (
            <>
              <NextImage
                key={media.id}
                src={media.url}
                alt={media.name}
                fill
                className="max-w-[500px] max-h-[500px] object-cover !relative rounded-sm border-2 border-gray-300"
                onClick={() => setOpenModal(true)}
              />
              <Modal
                title={media.name}
                content={media.url}
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
              />
            </>
          ))}
        </div>
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
