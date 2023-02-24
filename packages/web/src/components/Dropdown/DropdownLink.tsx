import { Button, ChevronDownIcon } from "ui"
import * as React from "react"
import NextLink from "next/link"
export const DropdownLink = (props: { list: any; title: any }) => {
  const { list, title } = props
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleDropdown() {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <div className="relative">
        <Button
          className="focus:shadow-outline rounded !bg-gray-400 py-2 px-4 font-medium !font-bold !text-black focus:outline-none"
          onClick={toggleDropdown}
        >
          <span className="mr-2">{title}</span>
          <ChevronDownIcon className="h-6 w-6" />
        </Button>
        {isOpen && (
          <div className="absolute z-[15] mt-1 rounded bg-white shadow-lg">
            {list.map(
              (
                game: {
                  title: string
                  slug: string
                },
                index: React.Key | null | undefined,
              ) => (
                <NextLink
                  key={index}
                  href={game.slug}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                >
                  {game.title}
                </NextLink>
              ),
            )}
          </div>
        )}
      </div>
    </>
  )
}
