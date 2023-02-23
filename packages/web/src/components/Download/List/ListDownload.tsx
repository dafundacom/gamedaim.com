import * as React from "react"

import NextImage from "next/image"
import { Button, Heading, IconButton, Text } from "@/../../ui"
import {
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaAppleAlt,
  FaXbox,
  FaPlaystation,
} from "react-icons/fa"
import { SiNintendoswitch } from "react-icons/si"

export const ListDownload = (props: { listDownloads: any }) => {
  const { listDownloads } = props
  function getIconSistemOperasi(sistemOperasi: string) {
    switch (sistemOperasi) {
      case "Windows":
        return <FaWindows />
      case "macOS":
        return <FaApple />
      case "Linux":
        return <FaLinux />
      case "Android":
        return <FaAndroid />
      case "iOS":
        return <FaAppleAlt />
      case "Xbox One":
        return <FaXbox />
      case "PlayStation 4":
        return <FaPlaystation />
      case "Nintendo Switch":
        return <SiNintendoswitch />
      default:
        return <FaWindows />
    }
  }
  const [prevDisplay, setPrevDisplay] = React.useState("md:!hidden")
  const [nextDisplay, setNextDisplay] = React.useState("md:!flex")
  const arrowClass =
    "!hidden justify-center content-center bg-white p-2 cursor-pointer !absolute !rounded-full"

  const contentRef: any = React.useRef(null)

  const content: any = contentRef.current
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
        className="scrollbarhide scrollbar relative mb-4 block h-auto min-w-full space-x-5 overflow-x-auto overflow-y-auto whitespace-nowrap px-3"
      >
        {listDownloads.map((list: any) => {
          const icon = getIconSistemOperasi(list.sistemOperasi[0])
          return (
            <>
              <div className="inline-block min-h-[350px] w-[200px] flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="relative">
                  <NextImage
                    src={list.gambar}
                    alt={list.judul}
                    width={400}
                    height={400}
                    className="h-[185px] w-[200px] max-w-[unset] object-cover"
                  />
                  <IconButton className="!text-primary-800 !absolute top-[5px] right-[5px] !w-[25px] !rounded-full bg-white !p-[1px]">
                    {icon}
                  </IconButton>
                </div>
                <Heading className="mt-3 whitespace-normal px-3 !text-base">
                  {list.judul}
                </Heading>
                <div className="mt-6 mb-3 flex justify-between px-3">
                  <Text className="!inline-block whitespace-normal">
                    {list.genre}
                  </Text>
                  <Text className="!text-[14px]">{list.ukuran}</Text>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}