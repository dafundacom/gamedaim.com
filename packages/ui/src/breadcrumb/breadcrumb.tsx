import * as React from "react"
import NextLink from "next/link"
import { tx } from "@twind/core"
import { getValidChildren } from "../children-utils"

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <span
      ref={ref}
      role="presentation"
      className={tx("mx-2 text-gray-600 dark:text-gray-200", className)}
      {...rest}
    />
  )
})

export interface BreadcrumbLinkProps {
  currentPage?: boolean
}

export const BreadcrumbLink = React.forwardRef<any, any>((props, ref) => {
  const { currentPage, ...rest } = props
  const Comp = currentPage ? "span" : NextLink

  return (
    <Comp
      ref={ref}
      className={
        currentPage
          ? "text-gray-400 dark:text-gray-400"
          : "text-gray-600 dark:text-gray-200"
      }
      aria-current={currentPage ? "page" : undefined}
      {...rest}
    />
  )
})

export interface BreadcrumbItemProps extends BreadcrumbProps {
  currentPage?: boolean
  lastChild?: boolean
  bold?: boolean
  semibold?: boolean
  medium?: boolean
}

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>((props, ref) => {
  const {
    currentPage,
    separator,
    lastChild,
    addSeparator,
    children,
    bold = false,
    semibold = false,
    medium = false,
    className,
    ...rest
  } = props

  const validChildren = getValidChildren(children)
  const clones = validChildren.map((child) => {
    if (child.type === BreadcrumbLink) {
      return React.cloneElement(child, { currentPage })
    }

    if (child.type === BreadcrumbSeparator) {
      return React.cloneElement(child, {
        children: child.props.children || separator,
      })
    }

    return child
  })

  return (
    <li
      ref={ref}
      className={tx(
        "inline-flex items-center whitespace-nowrap",
        bold && "font-bold",
        semibold && "font-semibold",
        medium && "font-medium",
        className,
      )}
      {...rest}
    >
      {clones}
      {!lastChild && addSeparator && (
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
      )}
    </li>
  )
})

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: string | React.ReactElement
  addSeparator?: boolean
  children?: React.ReactNode
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (props, ref) => {
    const {
      children,
      addSeparator = true,
      separator = "/",
      className,
      ...rest
    } = props
    const validChildren = getValidChildren(children)
    const clones = validChildren.map((child, index) => {
      return React.cloneElement(child, {
        addSeparator,
        separator,
        lastChild: validChildren.length === index + 1,
      })
    })

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={tx("relative mb-2", className)}
        {...rest}
      >
        <ol className="inline-flex">{clones}</ol>
      </nav>
    )
  },
)
