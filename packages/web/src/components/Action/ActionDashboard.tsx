import * as React from "react"
import NextLink from "next/link"
import { tx } from "@twind/core"

import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"
import { UrlObject } from "url"

export interface ActionDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDelete?: () => void
  onEdit?: () => void
  onView?: () => void
  deleteLink?: string | UrlObject
  editLink?: string | UrlObject
  viewLink?: string | UrlObject
  className?: string
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
    ...rest
  } = props

  return (
    <div ref={ref} className={tx("flex", className)} {...rest}>
      {viewLink && (
        <NextLink href={viewLink} target="_blank">
          <HiOutlineEye className="mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110 hover:text-primary-500" />
        </NextLink>
      )}

      {onView && (
        <HiOutlineEye
          className="mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110 hover:text-primary-500"
          onClick={onView}
        />
      )}

      {editLink && (
        <NextLink href={editLink}>
          <HiOutlinePencil className="mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110 hover:text-primary-500" />
        </NextLink>
      )}

      {onEdit && (
        <HiOutlinePencil
          className="mr-2 w-4 transform cursor-not-allowed cursor-pointer hover:scale-110 hover:text-primary-500"
          onClick={onEdit}
        />
      )}

      {deleteLink && (
        <NextLink href={deleteLink}>
          <HiOutlineTrash className="mr-2 w-4 transform cursor-pointer hover:scale-110 hover:text-primary-500" />
        </NextLink>
      )}

      {onDelete && (
        <HiOutlineTrash
          className="mr-2 w-4 transform cursor-pointer hover:scale-110 hover:text-primary-500"
          onClick={onDelete}
        />
      )}
    </div>
  )
})
