import * as React from "react"
import { Button } from "ui"
import { MdArrowBack, MdArrowForward } from "react-icons/md"

import { DownloadCard } from "@/components/Card"
import { DownloadDataProps } from "@/lib/data-types"

interface ListDownloadProps extends React.HTMLAttributes<HTMLDivElement> {
  listDownloads: DownloadDataProps
}

export const ListDownload = React.forwardRef<HTMLDivElement, ListDownloadProps>(
  (props, ref) => {
    const { listDownloads, ...rest } = props

    const [prevDisplay, setPrevDisplay] = React.useState("md:!hidden")
    const [nextDisplay, setNextDisplay] = React.useState("md:!flex")
    const [showArrow, setShowArrow] = React.useState(false)
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
          <DownloadCard list={listDownloads} />
        </div>
      </div>
    )
  },
)
