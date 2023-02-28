import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import { Button, Heading, Text } from "ui"
import { TopicDataProps } from "@/lib/data-types"
import { MdArrowBack, MdArrowForward } from "react-icons/md"

interface ListDownloadCategoryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  listCategories: TopicDataProps[]
}

export const ListDownloadCategory = React.forwardRef<
  HTMLDivElement,
  ListDownloadCategoryProps
>((props, ref) => {
  const { listCategories, ...rest } = props

  const [showArrow, setShowArrow] = React.useState(false)
  const [prevDisplay, setPrevDisplay] = React.useState("md:!hidden")
  const [nextDisplay, setNextDisplay] = React.useState("md:!flex")

  const arrowClass =
    "!hidden justify-center content-center !bg-white  hover:!bg-slate-800 hover:!text-white !p-2 cursor-pointer !ring-0 !absolute !rounded-full"

  const contentRef: any = React.useRef(null)
  const content: any = contentRef.current

  React.useEffect(() => {
    if (content && content.scrollWidth > content.offsetWidth) {
      setShowArrow(true)
    }
  }, [content])

  function handleNextClick() {
    if (content) {
      content.scrollBy(250, 0)
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
    content.scrollBy(-250, 0)
    if (content.scrollLeft < 200) {
      setPrevDisplay("md:!hidden")
    }
    if (content.scrollLeft - 210) {
      setNextDisplay("md:!flex")
    }
  }

  return (
    <div className="relative" ref={ref} {...rest}>
      {showArrow && (
        <>
          <Button
            onClick={handlePrevClick}
            id="prev"
            variant="outline"
            className={`${arrowClass} ${prevDisplay} left-0 top-[50%] !z-[8] hidden translate-x-2/4	-translate-y-2/4`}
          >
            <MdArrowBack />
          </Button>
          <Button
            onClick={handleNextClick}
            id="next"
            variant="outline"
            className={`${arrowClass} md:flex ${nextDisplay} right-[40px] top-[50%] !z-[8]	-translate-y-2/4 translate-x-2/4`}
          >
            <MdArrowForward />
          </Button>
        </>
      )}
      <div
        ref={contentRef}
        className="scrollbarhide scrollbar relative mb-4 block h-auto min-w-full space-x-5 overflow-x-auto overflow-y-auto whitespace-nowrap px-3"
      >
        {listCategories.map((list: any, i: number) => {
          return (
            <>
              <div
                key={i}
                className="inline-flex w-[200px] flex-row overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-700"
              >
                {list.featuredImage > 0 && (
                  <div className="relative">
                    <NextImage
                      src={list.featuredImage.url}
                      alt={list.title}
                      width={400}
                      height={400}
                      className="h-[135px] w-[70px] max-w-[unset] object-cover"
                    />
                  </div>
                )}
                <div className="flex w-[inherit] flex-col items-center justify-center">
                  <NextLink href={`/topic/${list.slug}`}>
                    <Heading className="mt-3 whitespace-normal px-3 !text-base">
                      {list.title}
                    </Heading>
                  </NextLink>

                  <div className="mb-3 px-3">
                    <Text className="!text-[14px]">{list?.description}</Text>
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
})
