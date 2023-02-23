import * as React from "react"
import NextImage from "next/image"
import { Heading, IconButton, Text } from "@/../../ui"
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

export const DownloadCard = (props: any) => {
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
  return (
    <>
      {listDownloads.map((list: any, i: React.Key | null | undefined) => {
        const icon = getIconSistemOperasi(list.operationSystem)
        return (
          <>
            <div
              key={i}
              className="inline-block min-h-[350px] w-[200px] flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="relative">
                <NextImage
                  src={list.featuredImage.url}
                  alt={list.title}
                  width={400}
                  height={400}
                  className="h-[185px] w-[200px] max-w-[unset] object-cover"
                />
                <IconButton className="!text-primary-800 !absolute top-[5px] right-[5px] !w-[25px] !rounded-full bg-white !p-[1px]">
                  {icon}
                </IconButton>
              </div>
              <Heading className="mt-3 whitespace-normal px-3 !text-base">
                {list.title}
              </Heading>
              <div className="mt-6 mb-3 flex justify-between px-3">
                <Text className="!inline-block whitespace-normal">
                  {list.downloadFiles[0]?.price}
                </Text>
                <Text className="!text-[14px]">
                  {list.downloadFiles[0]?.fileSize}
                </Text>
              </div>
            </div>
          </>
        )
      })}
    </>
  )
}
