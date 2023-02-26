import * as React from "react"
import NextLink from "next/link"
import { Button, ChevronDownIcon } from "ui"
import { TopicDataProps } from "@/lib/data-types"

interface DropdownLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  list: TopicDataProps[]
}

export const DropdownLink = React.forwardRef<HTMLDivElement, DropdownLinkProps>(
  (props, ref) => {
    const { list, title, ...rest } = props

    const [isOpen, setIsOpen] = React.useState(false)

    function toggleDropdown() {
      setIsOpen(!isOpen)
    }

    return (
      <>
        <div className="relative" ref={ref} {...rest}>
          <Button
            className="focus:shadow-outline !dark:bg-gray-700 !dark:text-gray-200 rounded !bg-gray-300 py-2 px-4 font-medium !font-bold !text-gray-800 focus:outline-none"
            onClick={toggleDropdown}
          >
            <span className="mr-2">{title}</span>
            <ChevronDownIcon className="h-6 w-6" />
          </Button>
          {isOpen && (
            <div className="absolute z-[15] mt-1 rounded bg-white shadow-lg">
              {list.map(
                (
                  list: {
                    title: string
                    slug: string
                  },
                  index: React.Key | null | undefined,
                ) => (
                  <NextLink
                    key={index}
                    href={`/download/topic/${list.slug}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {list.title}
                  </NextLink>
                ),
              )}
            </div>
          )}
        </div>
      </>
    )
  },
)
