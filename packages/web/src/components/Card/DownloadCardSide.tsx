import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { Heading } from "ui"

interface DownloadCardSlideProps {
  title: string
  slug: string
  src: string
}

export const DownloadCardSide = React.forwardRef<
  HTMLDivElement,
  DownloadCardSlideProps
>((props, ref) => {
  const { src, slug, title, ...rest } = props
  const [thumbnail, setThumbnail] = React.useState(src)

  return (
    <NextLink href={slug}>
      <article
        className="mb-4 flex w-full border-separate flex-col rounded-lg"
        ref={ref}
        {...rest}
      >
        <div className="relative flex max-w-xs flex-col space-y-3 md:max-w-3xl md:!flex-row md:space-x-4 md:space-y-0">
          <div className="relative">
            <NextImage
              priority={true}
              height={75}
              width={75}
              className="loading-comple aspect-[1/1] !h-[75px] !w-auto max-w-[unset] rounded-md object-cover"
              src={thumbnail}
              onError={(e: any) => {
                setThumbnail("/image/image-error.svg")
                e.target.style.backgroundColor = "#e7e7e7"
              }}
              onLoadingComplete={(e) => {
                e.classList.remove("loading-image")
              }}
              alt={title}
            />
          </div>
          <div className="flex w-full flex-col space-y-2 md:w-2/3">
            <Heading
              as="h3"
              className="!line-clamp-3 hover:text-primary-400 !text-sm !leading-5"
            >
              {title}
            </Heading>
          </div>
        </div>
      </article>
    </NextLink>
  )
})
