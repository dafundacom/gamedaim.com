import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import { MdAccessTime } from "react-icons/md"

import { Heading } from "ui"
import { cleanDate } from "@/utils/datetime"
import { wpAuthorPathBySlug } from "@/lib/wp-users"

interface MetadataPostProps extends React.HTMLAttributes<HTMLDivElement> {
  authorName: string
  authorAvatarUrl: string
  authorSlug: string
  date: string
}

export const MetadataPost = React.forwardRef<HTMLDivElement, MetadataPostProps>(
  (props, ref) => {
    const { authorName, authorAvatarUrl, authorSlug, date, ...rest } = props
    const [image, setImage] = React.useState(authorAvatarUrl) as any

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
            <div className="flex flex-col ml-[5px]">
              <NextLink href={wpAuthorPathBySlug(authorSlug)}>
                <Heading as="h4" className="ml-2 !text-base">
                  {authorName}
                </Heading>
              </NextLink>
              {date && (
                <div>
                  <MdAccessTime className="h-3 w-3 text-gray-700 dark:text-gray-200 inline-block" />
                  <time
                    className="ml-[6px] text-xs text-gray-700 dark:text-gray-200"
                    dateTime={date}
                  >
                    {cleanDate(date)}
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
