import * as React from "react"

import env from "@/env"
import { ShareButtonArticle } from "./ShareButtonArticle"

interface StickyShareProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  categorySlug: string
  postSlug: string
}

export const StickyShare = React.forwardRef<HTMLDivElement, StickyShareProps>(
  (props, ref) => {
    const { title, categorySlug, postSlug, ...rest } = props
    return (
      <div
        className="shadow-xs fixed top-[unset] bottom-0 left-0 z-40 mx-0 mr-2 mb-0 mr-0 flex h-fit w-full flex-row items-center justify-center bg-white dark:bg-gray-700 lg:!sticky lg:!top-20 lg:bottom-[unset] lg:left-[unset] lg:!w-auto lg:bg-transparent lg:px-2 lg:shadow-none lg:dark:bg-transparent"
        ref={ref}
        {...rest}
      >
        <ShareButtonArticle
          url={`https://${env.SITE_TITLE}/${categorySlug}/${postSlug}`}
          text={title}
        />
      </div>
    )
  },
)
