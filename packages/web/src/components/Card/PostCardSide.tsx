import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { Heading } from "ui"

interface PostCardSlideProps {
  title: string
  slug: string
  src: string
  alt: string
}

export const PostCardSide = React.forwardRef<
  HTMLDivElement,
  PostCardSlideProps
>((props, ref) => {
  const { src, alt, slug, title, ...rest } = props
  const [image, setImage] = React.useState("/image/imgloader.gif") as any

  return (
    <NextLink href={slug}>
      <article
        className="flex w-full flex-col rounded-lg drop-shadow-md mb-4 border-separate"
        ref={ref}
        {...rest}
      >
        <div className="relative flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 max-w-xs md:max-w-3xl">
          <div className="relative">
            <NextImage
              priority={true}
              height={75}
              width={75}
              className="!w-auto rounded-md aspect-[1/1] object-cover !h-[75px] max-w-[unset]"
              src={image}
              onLoadingComplete={() => {
                setImage(src)
              }}
              alt={alt}
            />
          </div>
          <div className="w-full md:w-2/3 flex flex-col space-y-2">
            <Heading
              as="h3"
              className="!text-sm !leading-5 !line-clamp-3 hover:text-primary-400"
            >
              {title}
            </Heading>
          </div>
        </div>
      </article>
    </NextLink>
  )
})
