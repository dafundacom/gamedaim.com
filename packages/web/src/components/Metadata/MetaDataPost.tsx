import * as React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import NextImage from "next/image"
import NextLink from "next/link"
import { MdAccessTime } from "react-icons/md"

import { WpPostsDataProps } from "@/lib/wp-data-types"
import { wpAuthorPathBySlug } from "@/lib/wp-users"
import { Heading } from "ui"

interface MetadataPostProps
  extends WpPostsDataProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MetadataPost = React.forwardRef<HTMLDivElement, MetadataPostProps>(
  (props, ref) => {
    const { authorName, authorAvatarUrl, authorSlug, date, ...rest } = props

    const [image, setImage] = React.useState(authorAvatarUrl) as any

    dayjs.extend(relativeTime)

    return (
      <div className="flex-column flex" ref={ref} {...rest}>
        <div className="my-2 flex flex-row items-center gap-2">
          <div className="flex flex-row items-center">
            {authorAvatarUrl && (
              <NextImage
                width="40"
                height="40"
                src={image}
                onError={() => {
                  setImage("/icons/author.jpg")
                }}
                alt={authorName}
                className="rounded-full object-cover"
              />
            )}
            <div className="ml-[5px] flex flex-col">
              <NextLink href={wpAuthorPathBySlug(authorSlug)}>
                <Heading as="h4" className="ml-2 !text-base">
                  {authorName}
                </Heading>
              </NextLink>
              {date && (
                <div>
                  <MdAccessTime className="inline-block h-3 w-3 text-gray-700 dark:text-gray-200" />
                  <time
                    className="ml-[6px] text-xs text-gray-700 dark:text-gray-200"
                    dateTime={date}
                  >
                    {dayjs(date).fromNow()}
                  </time>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
)
