import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { MdAccessTime } from "react-icons/md"

import { Heading } from "ui"

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  src: string
  alt: string
  authorName: string
  authorUri: string
  authorAvatarUrl: string
  date: string
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
    const [imageAvatar, setImageAvatar] = React.useState(authorAvatarUrl) as any
    const [image, setImage] = React.useState("/image/imgloader.gif") as any
    dayjs.extend(relativeTime)
    return (
      <article
        className="flex flex-row grow lg:flex-col rounded-lg drop-shadow-md mb-[30px] border-separate"
        ref={ref}
        {...rest}
      >
        <div className="relative w-full justify-between lg:!justify-start flex flex-row">
          <NextLink
            href={isWP ? slug : `/article/${slug}`}
            shallow={true}
            className="order-2 md:order-1 md:mr-[30px]"
          >
            <NextImage
              priority={true}
              height={250}
              width={350}
              className="post-card-thumbnail w-[125px] min-w-[125px] min-h-[90px] h-[90px] md:!w-[270px] md:!min-w-[270px] md:!h-[193px] md:!min-h-full object-cover rounded-lg"
              src={image}
              onLoadingComplete={() => {
                setImage(src)
              }}
              alt={alt}
            />
          </NextLink>
          <div className="order-1 md:order-2 mr-3 md:mr-[unset] flex flex-col">
            <NextLink href={isWP ? slug : `/article/${slug}`}>
              <Heading
                as="h3"
                className="!text-xl !font-bold hover:text-primary-400"
                lineClamp={3}
              >
                {title}
              </Heading>
              <div
                className="hidden md:my-[10px] md:inline-flex text-gray-500 dark:text-gray-300 text-[15px] md:!line-clamp-2"
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            </NextLink>
            <div className="flex-column flex">
              <div className="flex flex-row items-center">
                {authorName && (
                  <>
                    <div className="hidden md:flex flex-row items-center">
                      {authorAvatarUrl && (
                        <NextImage
                          width="20"
                          height="20"
                          src={imageAvatar}
                          onError={() => {
                            setImageAvatar("/icons/author.jpg")
                          }}
                          alt={authorName}
                          className="rounded-full object-cover bg-[url('/icons/author.jpg')]"
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
                <MdAccessTime className="h-3 w-3 md:ml-2 text-gray-700 dark:text-gray-200" />
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
