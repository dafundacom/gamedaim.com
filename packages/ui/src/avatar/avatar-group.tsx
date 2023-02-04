import * as React from "react"
import { tx } from "@twind/core"
import { getValidChildren } from "../children-utils"
import { Avatar, AvatarProps } from "./avatar"

export interface AvatarGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode
  max?: number
  size?: AvatarProps["size"]
}

export const AvatarGroup: React.FunctionComponent<AvatarGroupProps> = (
  props,
) => {
  const { size, children, max, className, ...rest } = props

  const validChildren = getValidChildren(children)
  const childrenWithinMax = max ? validChildren.slice(0, max) : validChildren
  const excess = max != null && validChildren.length - max
  const reversedChildren = childrenWithinMax.reverse()

  const clones = reversedChildren.map((child, index) => {
    let isFirstAvatar = index === 0
    return React.cloneElement(child, {
      size,
      className: tx(child.props.className, isFirstAvatar ? "mr-0" : "-mr-3"),
      bordered: true,
    })
  })

  return (
    <div role="group" className={className} {...rest}>
      {excess > 0 && (
        <Avatar
          size={size}
          name={`+${excess}`}
          className="-ml-3"
          isFullName
          bordered
        />
      )}
      {clones}
    </div>
  )
}
