import * as React from "react"
import NextLink from "next/link"
import { tx } from "@twind/core"

import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"
import { UrlObject } from "url"
import { ModalDelete } from "@/components/Modal"

export interface ActionDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDelete?: () => void
  onEdit?: () => void
  onView?: () => void
  deleteLink?: string | UrlObject
  editLink?: string | UrlObject
  viewLink?: string | UrlObject
  className?: string
  content?: string
}

export const ActionDashboard = React.forwardRef<
  HTMLDivElement,
  ActionDashboardProps
>((props, ref) => {
  const {
    onDelete,
    onEdit,
    onView,
    deleteLink,
    editLink,
    viewLink,
    className,
    content,
    ...rest
  } = props
  const [openModal, setOpenModal] = React.useState<boolean>(false)

  return (
    <div
      ref={ref}
      className={tx(
        "flex content-center items-center justify-center text-center",
        className,
      )}
      {...rest}
    >
      {viewLink && (
        <NextLink href={viewLink} target="_blank">
          <HiOutlineEye className="hover:text-primary-500 mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110" />
        </NextLink>
      )}

      {onView && (
        <HiOutlineEye
          className="hover:text-primary-500 mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110"
          onClick={onView}
        />
      )}

      {editLink && (
        <NextLink href={editLink}>
          <HiOutlinePencil className="hover:text-primary-500 mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110" />
        </NextLink>
      )}

      {onEdit && (
        <HiOutlinePencil
          className="hover:text-primary-500 mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110"
          onClick={onEdit}
        />
      )}

      {deleteLink && (
        <NextLink href={deleteLink}>
          <HiOutlineTrash className="hover:text-primary-500 mr-2 w-4 transform cursor-pointer hover:scale-110" />
        </NextLink>
      )}

      {onDelete && (
        <>
          <HiOutlineTrash
            className="hover:text-primary-500 mr-2 w-4 transform cursor-pointer hover:scale-110"
            onClick={() => setOpenModal(true)}
          />
          <ModalDelete
            desc={<>{content}</>}
            isOpen={openModal}
            className="max-w-[366px]"
            onDelete={onDelete}
            onClose={() => setOpenModal(false)}
          />
        </>
      )}
    </div>
  )
})
