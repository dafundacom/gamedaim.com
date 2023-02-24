import * as React from "react"
import { Button } from "ui"

import { DownloadCard } from "@/components/Card"

export const ListDownload = (props: { listDownloads: any }) => {
  const { listDownloads } = props

  const [prevDisplay, setPrevDisplay] = React.useState("md:!hidden")
  const [nextDisplay, setNextDisplay] = React.useState("md:!flex")
  const [showArrow, setShowArrow] = React.useState(false)
  const arrowClass =
    "!hidden justify-center content-center bg-white p-2 cursor-pointer !absolute !rounded-full"

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
    <div className="relative">
      {showArrow && (
        <>
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
}
