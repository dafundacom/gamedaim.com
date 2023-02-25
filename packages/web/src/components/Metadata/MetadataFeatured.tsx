import * as React from "react"
import NextLink from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { IoGameController } from "react-icons/io5"
import { ImBook } from "react-icons/im"
import { BiMovie, BiTv } from "react-icons/bi"

import { WpCategoriesDataProps } from "@/lib/wp-data-types"
import {
  wpPrimaryCategorySlug,
  wpCategoryPathBySlug,
} from "@/lib/wp-categories"

interface MetadataFeaturedProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: WpCategoriesDataProps[]
  date: string
}

export const MetadataFeatured = React.forwardRef<
  HTMLDivElement,
  MetadataFeaturedProps
>((props, ref) => {
  const { categories, date, ...rest } = props

  const { primary } = wpPrimaryCategorySlug(categories)
  let categoryIcon

  if (primary.slug == "games") {
    categoryIcon = <IoGameController className="h-3 w-3" />
  } else if (primary.slug == "comics") {
    categoryIcon = <ImBook className="h-3 w-3" />
  } else if (primary.slug == "movies") {
    categoryIcon = <BiMovie className="h-3 w-3" />
  } else if (primary.slug == "tv") {
    categoryIcon = <BiTv className="h-3 w-3" />
  }

  dayjs.extend(relativeTime)

  return (
    <div className="flex flex-row" {...rest} ref={ref}>
      <div className="my-1 flex flex-row items-center text-gray-200 dark:text-gray-100">
        {categories && (
          <>
            <div className="flex flex-row items-center">
              <NextLink
                className={`line-clamp-1 hover:text-primary-400 cursor-pointer`}
                href={wpCategoryPathBySlug(primary.slug)}
              >
                {categoryIcon && (
                  <span className="mr-1 inline-flex">{categoryIcon}</span>
                )}
                <span className="inline-flex text-sm">{primary.name}</span>
              </NextLink>
            </div>
          </>
        )}
        <span className="ml-1 text-sm">&bull;</span>
        {date && (
          <time className={`line-clamp-1 pl-1 text-sm`} dateTime={date}>
            {dayjs(date).fromNow()}
          </time>
        )}
      </div>
    </div>
  )
})
