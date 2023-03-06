import * as React from "react"
import { IconButton } from "ui"
import { ModalDelete } from "../Modal"
import { MdOutlineDelete } from "react-icons/md"
export const DeleteMediaButton = (props: {
  content: any
  deleteMedia: () => void
}) => {
  const { content, deleteMedia } = props
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  return (
    <>
      <IconButton
        colorScheme="red"
        className="!absolute z-20 !rounded-full !p-0"
        onClick={() => setOpenModal(true)}
      >
        <MdOutlineDelete />
      </IconButton>
      <ModalDelete
        desc={<>{content}</>}
        isOpen={openModal}
        className="max-w-[366px]"
        onDelete={deleteMedia}
        onClose={() => setOpenModal(false)}
      />
    </>
  )
}
