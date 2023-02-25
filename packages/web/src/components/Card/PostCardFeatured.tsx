import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import { Button } from "ui"

import { WpPostsDataProps } from "@/lib/wp-data-types"

export interface PostCardFeaturedProps
  extends WpPostsDataProps,
    React.HTMLAttributes<HTMLDivElement> {
  index?: number
}

export const PostCardFeatured = React.forwardRef<
  HTMLDivElement,
  PostCardFeaturedProps
>(({ post, ...props }, ref) => {
  const { title, featuredImage, uri } = post
  const [image, setImage] = React.useState("/image/imgloader.gif") as any
  return (
    <>
      <article
        className="post-card-thumbnail whitspace-normal relative h-full overflow-hidden rounded-xl"
        {...props}
        ref={ref}
      >
        <div className="h-full">
          <NextLink
            className="after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-xl after:bg-gradient-to-t after:from-[#282828] after:to-transparent after:transition-all"
            href={uri}
          >
            <div className="relative box-border overflow-hidden">
              <NextImage
                priority={true}
                height={500}
                width={600}
                className="aspect-[8/16] !h-[300px] !w-auto rounded-md object-cover transition-all md:!aspect-[9/16]"
                src={image}
                onLoadingComplete={() => {
                  setImage(featuredImage?.sourceUrl)
                }}
                alt={featuredImage?.altText ?? ""}
              />
            </div>
          </NextLink>
        </div>
        <div className="featured-meta absolute bottom-0 left-0 z-[7] w-full p-[20px] md:py-5 md:px-4 min-[992px]:p-[25px]">
          <NextLink href={uri}>
            <h3
              className={`line-clamp-4 hover:text-primary-400 text-xl font-bold !leading-[1.3] !text-white dark:text-gray-100`}
            >
              {title}
            </h3>
          </NextLink>
        </div>
      </article>
    </>
  )
})

export const ListPostFeatured = (props: { featured: any }) => {
  const { featured } = props
  const [prevDisplay, setPrevDisplay] = React.useState("md:!hidden")
  const [nextDisplay, setNextDisplay] = React.useState("md:!flex")
  const arrowClass =
    "!hidden justify-center content-center bg-white p-2 cursor-pointer !absolute rounded-full"

  const contentRef: any = React.useRef(null)

  const content: any = contentRef.current

  function handleNextClick() {
    if (content) {
      content.scrollBy(200, 0)
      if (content.scrollLeft > 190) {
        setPrevDisplay("md:!flex")
      }
      if (
        content.scrollLeft >=
        content.scrollWidth - content.offsetWidth - 200
      ) {
        setNextDisplay("md:!hidden")
      }
    }
  }

  function handlePrevClick() {
    content.scrollBy(-200, 0)
    if (content.scrollLeft < 200) {
      setPrevDisplay("md:!hidden")
    }
    if (content.scrollLeft - 210) {
      setNextDisplay("md:!flex")
    }
  }

  return (
    <div className="relative mx-auto w-full min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
      <Button
        onClick={handlePrevClick}
        id="prev"
        variant="outline"
        className={`${arrowClass} ${prevDisplay} left-0 top-[50%] !z-[8] hidden translate-x-2/4	-translate-y-2/4`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
        </svg>
      </Button>
      <Button
        onClick={handleNextClick}
        id="next"
        variant="outline"
        className={`${arrowClass} md:flex ${nextDisplay} right-[40px] top-[50%] !z-[8]	-translate-y-2/4 translate-x-2/4`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
        </svg>
      </Button>
      <div
        ref={contentRef}
        className="scrollbarhide scrollbar relative mb-4 block h-auto min-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap px-3"
      >
        {featured.map((featuredItem: any, i: number) => {
          return (
            <div
              className={`featured-image inline-block whitespace-normal pr-[15px]`}
              key={featuredItem.slug}
            >
              <PostCardFeatured index={i} post={featuredItem} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
