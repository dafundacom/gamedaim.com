import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { MdAccessTime } from "react-icons/md"

import { Heading } from "ui"
import { WpPostsDataProps } from "@/lib/wp-data-types"

interface PostCardProps extends WpPostsDataProps {
  isWP?: boolean
}

export const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  (props, ref) => {
    const {
      src,
      alt,
      slug,
      excerpt,
      title,
      authorName,
      authorUri,
      authorAvatarUrl,
      date,
      isWP = true,
      ...rest
    } = props

    const [imageAvatar, setImageAvatar] = React.useState(authorAvatarUrl)
    const [image, setImage] = React.useState("/image/imgloader.gif")

    dayjs.extend(relativeTime)

    return (
      <article
        className="mb-[30px] flex grow border-separate flex-row rounded-lg drop-shadow-md lg:flex-col"
        ref={ref}
        {...rest}
      >
        <div className="relative flex w-full flex-row justify-between lg:!justify-start">
          <NextLink
            href={isWP ? slug : (`/article/${slug}` as any)}
            shallow={true}
            className="order-2 md:order-1 md:mr-[30px]"
          >
            <NextImage
              priority={true}
              height={250}
              width={350}
              className="post-card-thumbnail h-[90px] min-h-[90px] w-[125px] min-w-[125px] rounded-lg object-cover md:!h-[193px] md:!min-h-full md:!w-[270px] md:!min-w-[270px]"
              src={image}
              onLoadingComplete={() => {
                setImage(src)
              }}
              alt={alt}
            />
          </NextLink>
          <div className="order-1 mr-3 flex flex-col md:order-2 md:mr-[unset]">
            <NextLink href={isWP ? slug : (`/article/${slug}` as any)}>
              <Heading
                as="h3"
                className="hover:text-primary-400 !text-xl !font-bold"
                lineClamp={3}
              >
                {title}
              </Heading>
              <div className="md:!line-clamp-2 hidden text-[15px] text-gray-500 dark:text-gray-300 md:my-[10px] md:inline-flex">
                {excerpt}
              </div>
            </NextLink>
            <div className="flex-column flex">
              <div className="flex flex-row items-center">
                {authorName && (
                  <>
                    <div className="hidden flex-row items-center md:flex">
                      {authorAvatarUrl && (
                        <NextImage
                          width="20"
                          height="20"
                          src={imageAvatar}
                          onError={() => {
                            setImageAvatar("/icons/author.jpg")
                          }}
                          alt={authorName}
                          className="rounded-full bg-[url('/icons/author.jpg')] object-cover"
                        />
                      )}
                      <NextLink href={authorUri} shallow={true}>
                        <Heading bold as="h4" className="ml-2 !text-[12px] ">
                          {authorName}
                        </Heading>
                      </NextLink>
                    </div>
                  </>
                )}
                <MdAccessTime className="h-3 w-3 text-gray-700 dark:text-gray-200 md:ml-2" />
                {date && (
                  <time
                    className="pl-0.5 text-xs text-gray-700 dark:text-gray-200"
                    dateTime={date}
                  >
                    {dayjs(date).fromNow()}
                  </time>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  },
)
