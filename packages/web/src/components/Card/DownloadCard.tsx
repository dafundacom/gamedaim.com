import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
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
import { Heading, IconButton, Text } from "ui"
import { DownloadDataProps } from "@/lib/data-types"

interface DownloadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  list: DownloadDataProps
}

export const DownloadCard = React.forwardRef<HTMLDivElement, DownloadCardProps>(
  (props, ref) => {
    const { list, ...rest } = props

    return (
      <>
        {list.map((list: any) => {
          const icon = getIconOperatingSystem(list.operationSystem)

          return (
            <>
              <div
                key={list.id}
                className="inline-block min-h-[350px] w-[200px] flex-col overflow-hidden rounded-lg shadow-lg"
                ref={ref}
                {...rest}
              >
                <div className="relative">
                  <NextLink
                    href={`/download/${list.type.toLowerCase()}/${list.slug}`}
                  >
                    <NextImage
                      src={list.featuredImage.url}
                      alt={list.title}
                      width={400}
                      height={400}
                      className="h-[185px] w-[200px] max-w-[unset] object-cover"
                    />
                  </NextLink>
                  <IconButton className="!text-primary-800 !absolute top-[5px] right-[5px] !w-[25px] !rounded-full !bg-white bg-white !p-[1px]">
                    {icon}
                  </IconButton>
                </div>
                <NextLink
                  href={`/download/${list.type.toLowerCase()}/${list.slug}`}
                >
                  <Heading className="mt-3 whitespace-normal px-3 !text-base">
                    {list.title}
                  </Heading>
                </NextLink>
                <div className="mt-6 mb-3 flex justify-between px-3">
                  <Text className="!inline-block whitespace-normal">
                    {/* {list?.downloadFiles[0]?.price} */}Test
                  </Text>
                  <Text className="!text-[14px]">
                    {/* {list?.downloadFiles[0]?.fileSize} */}Test
                  </Text>
                </div>
              </div>
            </>
          )
        })}
      </>
    )
  },
)

function getIconOperatingSystem(operatingSystem: string) {
  switch (operatingSystem) {
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
